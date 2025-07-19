import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageDataUrl, userId, prompt, title, materials_csv } = req.body;

  if (!imageDataUrl || !userId || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Convert base64 to buffer
    const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to Supabase bucket
    const filename = `flux-output-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage.from("user-images").upload(filename, buffer, {
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
