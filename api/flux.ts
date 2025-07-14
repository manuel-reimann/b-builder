// @ts-ignore
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { image, prompt } = req.body;

  if (!image || !prompt) {
    return res.status(400).json({ error: "Missing image or prompt" });
  }

  try {
    const fluxRes = await fetch("https://api.bfl.ai/v1/flux-kontext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BFL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        image, // base64 string
        model: "flux-kontext-pro",
        return_base64: true,
      }),
    });

    if (!fluxRes.ok) {
      const text = await fluxRes.text();
      return res.status(500).json({ error: `Flux API error: ${text}` });
    }

    const data = await fluxRes.json();

    return res.status(200).json({ image: data.image });
  } catch (error) {
    return res.status(500).json({ error: "Internal error", details: error });
  }
}
