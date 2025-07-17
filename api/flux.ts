// @ts-ignore
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

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
  const { image, prompt } = body;
  const { userId, title, materials_csv } = body;

  if (!image || !prompt || !userId || !title || !materials_csv) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
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

    if (!fluxInitRes.ok) {
      const errorText = await fluxInitRes.text();
      return new Response(JSON.stringify({ error: "Initial request failed", details: errorText }), {
        status: 500,
      });
    }

    const { polling_url } = await fluxInitRes.json();
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
      if (pollJson.status === "Ready") {
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
      return new Response(JSON.stringify({ error: "Image not ready after polling" }), {
        status: 500,
      });
    }

    // Save result to Supabase
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { error } = await supabase.from("user_designs").insert({
      user_id: userId,
      title,
      image_url: finalData.result.sample,
      prompt,
      materials_csv,
    });

    if (error) {
      console.error("Supabase insert failed:", error);
      return new Response(JSON.stringify({ error: "Failed to save to database" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ image: finalData.result.sample }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal error", details: error }), {
      status: 500,
    });
  }
}
