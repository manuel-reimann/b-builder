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
    // Log the received prompt and image base64 (truncated)
    console.log("Received prompt:", prompt);
    console.log("Received image base64 (truncated):", image.substring(0, 100) + "...");

    // The actual fetch call to Flux API is kept commented out for now
    /*
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
    */

    const dataUrl = image;

    console.log("To download the image client-side, use a link element with href set to the base64 string.");
    console.log("Download this image:", dataUrl);

    return new Response(
      JSON.stringify({
        image: dataUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal error", details: error }), {
      status: 500,
    });
  }
}
