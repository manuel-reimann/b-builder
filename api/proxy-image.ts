import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url;

  if (typeof url !== "string") {
    console.error("❌ Missing or invalid URL in request query");
    res.status(400).send("Missing or invalid URL");
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
  } catch (err: any) {
    console.error("❗ Proxy error during fetch:", err);
    res.status(500).send(`Proxy error: ${err.message}`);
  }
}
