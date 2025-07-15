// @ts-ignore
import { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "edge", // or "nodejs"
};

export async function POST(req: Request): Promise<Response> {
  const { image, prompt } = await req.json();

  if (!image || !prompt) {
    return new Response(JSON.stringify({ error: "Missing image or prompt" }), {
      status: 400,
    });
  }

  try {
    const fluxRes = await fetch("https://api.bfl.ai/flux-kontext-pro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BFL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        input_image: image,
        aspect_ratio: "1:1",
        return_base64: true,
      }),
    });

    if (!fluxRes.ok) {
      const errorText = await fluxRes.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
      });
    }

    const data = await fluxRes.json();

    // Optional: Output base64 string to console (nur für Debugging)
    console.log("Flux result image (truncated):", data.image?.substring(0, 50) + "...");

    // Rückgabe inkl. direkter Vorschau-URL im Browser
    return new Response(
      JSON.stringify({
        image: data.image,
        downloadUrl: `data:image/jpeg;base64,${data.image}`,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal error", details: error }), {
      status: 500,
    });
  }
}
