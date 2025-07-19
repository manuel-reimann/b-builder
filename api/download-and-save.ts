import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl, userId, prompt, title, materials_csv } = req.body;

  if (!imageUrl || !userId || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch the image as a buffer from remote URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to download image from URL" });
    }
    const buffer = await response.arrayBuffer();

    // Upload to Supabase bucket
    const filename = `flux-output-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage.from("user-images").upload(filename, Buffer.from(buffer), {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/png",
    });

    if (uploadError) {
      return res.status(500).json({ error: "Upload failed", detail: uploadError.message });
    }

    const { data } = supabase.storage.from("user-images").getPublicUrl(filename);
    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      return res.status(500).json({ error: "Could not retrieve public URL" });
    }

    // Save to user_designs
    const { error: insertError } = await supabase.from("user_designs").insert({
      user_id: userId,
      image_url: publicUrl,
      prompt,
      title,
      materials_csv,
    });

    if (insertError) {
      return res.status(500).json({ error: "Insert failed", detail: insertError.message });
    }

    return res.status(200).json({ success: true, url: publicUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
