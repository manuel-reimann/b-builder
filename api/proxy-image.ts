// /api/proxy-image.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url) {
    console.error("❌ Missing URL in request query");
    res.status(400).send("Missing URL");
    return;
  }

  console.log("📡 Proxy fetching image from:", url);

  try {
    const imageRes = await fetch(url);
    console.log("📥 Response status:", imageRes.status, imageRes.statusText);

    if (!imageRes.ok) {
      throw new Error(`Fetch failed: ${imageRes.statusText}`);
    }

    res.setHeader("Content-Type", "image/png");
    const buffer = await imageRes.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("❗ Proxy error during fetch:", err);
    res.status(500).send("Proxy error");
  }
}
