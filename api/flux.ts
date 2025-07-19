import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import { VercelRequest, VercelResponse } from "@vercel/node";

type FluxPollingResponse = {
  status: string;
  result?: {
    sample?: string;
  };
};

export const config = {
  runtime: "edge", // or "nodejs"
};

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  console.log("Incoming request body:", body);
  console.log("🔍 Payload received in /api/flux:", body);
  const { image, prompt } = body;

  if (!image || !prompt) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    console.log("🧾 Prepared image payload:", image.slice(0, 30));
    // Step 1: Send POST request to BFL API
    const fluxInitRes = await fetch("https://api.bfl.ai/v1/flux-kontext-pro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-key": process.env.BFL_API_KEY ?? "",
      },
      body: JSON.stringify({
        prompt,
        input_image: image.replace(/^data:image\/\w+;base64,/, ""),
      }),
    });
    console.log("📤 Sent request to BFL API");

    if (!fluxInitRes.ok) {
      console.error("❌ Flux init request failed with status:", fluxInitRes.status);
      const errorText = await fluxInitRes.text();
      console.error("Flux init failed:", errorText);
      return new Response(JSON.stringify({ error: "Initial request failed", details: errorText }), {
        status: 500,
      });
    }

    const { polling_url } = await fluxInitRes.json();
    console.log("✅ Received polling_url:", polling_url);
    if (!polling_url) {
      return new Response(JSON.stringify({ error: "Missing polling_url from response" }), {
        status: 500,
      });
    }

    // Step 2: Polling for completion
    let finalData: FluxPollingResponse | null = null;
    for (let i = 0; i < 20; i++) {
      const pollRes = await fetch(polling_url, {
        method: "GET",
        headers: {
          "x-key": process.env.BFL_API_KEY ?? "",
        },
      });

      const pollJson: FluxPollingResponse = await pollRes.json();
      console.log(`⏳ Poll attempt ${i + 1}, status:`, pollJson.status);
      console.log("📩 Polling response:", pollJson);
      if (pollJson.status === "Ready") {
        console.log("🎉 Flux result ready:", pollJson.result?.sample);
        finalData = pollJson;
        break;
      } else if (pollJson.status === "Failed" || pollJson.status === "Error") {
        return new Response(JSON.stringify({ error: "Flux processing failed", details: pollJson }), {
          status: 500,
        });
      }

      await new Promise((res) => setTimeout(res, 1000));
    }

    if (!finalData || !finalData.result?.sample) {
      console.error("⚠️ Polling did not return a final image in time.");
      return new Response(JSON.stringify({ error: "Image not ready after polling" }), {
        status: 500,
      });
    }

    // Download the image from Flux and upload to Supabase Storage
    const fluxImageUrl = finalData.result.sample;
    console.log("📡 Lade Bild von Flux:", fluxImageUrl);

    const imageResponse = await fetch(fluxImageUrl);
    if (!imageResponse.ok) {
      console.error("❌ Fehler beim Laden des Bildes von Flux:", imageResponse.status);
      return new Response(JSON.stringify({ error: "Failed to download image from Flux" }), {
        status: 500,
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageName = `flux-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage.from("user-images").upload(imageName, imageBuffer, {
      contentType: "image/png",
      upsert: false,
    });

    if (uploadError) {
      console.error("❌ Fehler beim Upload zu Supabase:", uploadError);
      return new Response(JSON.stringify({ error: "Upload to Supabase failed" }), {
        status: 500,
      });
    }

    const { data: publicUrlData } = supabase.storage.from("user-images").getPublicUrl(imageName);

    const publicUrl = publicUrlData.publicUrl;
    console.log("✅ Bild in Supabase gespeichert:", publicUrl);

    return new Response(JSON.stringify({ image: publicUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("🔥 Uncaught error in /api/flux:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error }), {
      status: 500,
    });
  }
}
