import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed" });
    return;
  }

  const { imageDataUrl, userId, title, prompt, materials_csv } = req.body;

  if (!imageDataUrl || !userId || !title || !prompt || !materials_csv) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    // Decode base64 image
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `${Date.now()}_${title.replace(/\s+/g, "_")}.png`;

    const { error: uploadError } = await supabase.storage.from("user-designs").upload(filename, buffer, {
      contentType: "image/png",
      upsert: true,
    });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("user-designs").getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from("user_designs").insert({
      user_id: userId,
      image_url: publicUrl,
      prompt,
      title,
      materials_csv,
    });

    if (dbError) throw dbError;

    res.status(200).json({ publicUrl });
  } catch (err: any) {
    console.error("[DOWNLOAD-SAVE ERROR]", err);
    res.status(500).json({ error: err.message ?? "Unknown error" });
  }
}
