// /api/proxy-image.ts
// Import necessary types from Vercel for request and response handling
import type { VercelRequest, VercelResponse } from "@vercel/node";
// Import node-fetch to perform HTTP requests
import fetch from "node-fetch";

// Main handler function for the API route
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract the "url" parameter from the request query string
  const url = req.query.url as string;
  if (!url) {
    // If no URL is provided, log an error and respond with status 400
    console.error("❌ Missing URL in request query");
    res.status(400).send("Missing URL");
    return;
  }

  // Log the URL being fetched by the proxy
  console.log("📡 Proxy fetching image from:", url);

  try {
    // Fetch the image from the provided external URL
    const imageRes = await fetch(url);
    // Log the status of the image fetch response
    console.log("📥 Response status:", imageRes.status, imageRes.statusText);

    // If the fetch was not successful, throw an error
    if (!imageRes.ok) {
      throw new Error(`Fetch failed: ${imageRes.statusText}`);
    }

    // Set the Content-Type header to match the fetched image's content type, defaulting to PNG
    res.setHeader("Content-Type", imageRes.headers.get("content-type") || "image/png");
    // Set Cache-Control header to allow caching of the image for 1 day (optional)
    res.setHeader("Cache-Control", "public, max-age=86400"); // Optional: cache 1 day
    // Read the image response as an array buffer and send it to the client as a Buffer
    const buffer = await imageRes.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    // If any errors occur during fetch, log them and return a 500 error response
    console.error("❗ Proxy error during fetch:", err);
    res.status(500).send("Proxy error");
  }
}
