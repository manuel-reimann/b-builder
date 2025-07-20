import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed" });
    return;
  }

  const { imageUrl, userId, title } = req.body;

  if (!imageUrl || !userId || !title) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Image fetch failed: ${imageRes.statusText}`);
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${Date.now()}_${title.replace(/\s+/g, "_")}.png`;

    const { error } = await supabase.storage.from("user-designs").upload(filename, buffer, {
      contentType: "image/png",
      upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("user-designs").getPublicUrl(filename);
    res.status(200).json({ publicUrl: urlData.publicUrl });
  } catch (err: any) {
    console.error("[DOWNLOAD-SAVE ERROR]", err);
    res.status(500).json({ error: err.message ?? "Unknown error" });
  }
}
