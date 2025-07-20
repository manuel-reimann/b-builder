// /api/proxy-image.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// native fetch is supported in modern Node runtimes (no need for node-fetch)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url) {
    console.error("❌ Missing URL in request query");
    res.status(400).send("Missing URL");
    return;
  }

  console.log("📡 Proxy fetching image from:", url);

  try {
    const imageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // helps with CORS / security
      },
    });

    console.log("📥 Response status:", imageRes.status, imageRes.statusText);

    if (!imageRes.ok) {
      throw new Error(`Fetch failed: ${imageRes.statusText}`);
    }

    const contentType = imageRes.headers.get("content-type") || "image/png";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = Buffer.from(await imageRes.arrayBuffer());
    res.status(200).send(buffer);
  } catch (err) {
    console.error("❗ Proxy error during fetch:", err);
    res.status(500).send(`Proxy error: ${(err as Error).message}`);
  }
}
