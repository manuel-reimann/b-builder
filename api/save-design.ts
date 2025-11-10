//first save of the design to the database, after the proxy image has been fetched
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

console.log("ENV SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("ENV SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { userId, image_url, prompt, title, materials_csv } = req.body as {
      userId: string;
      image_url: string;
      prompt: string;
      title: string;
      materials_csv: string;
    };

    console.log("userId:", userId);
    console.log("image_url:", image_url);
    console.log("prompt:", prompt);
    console.log("title:", title);
    console.log("materials_csv:", materials_csv);

    if (!userId || !image_url || !prompt || !title || !materials_csv) {
      return res.status(400).send("Missing required fields");
    }

    const { error } = await supabase.from("user_designs").insert({
      user_id: userId,
      image_url,
      prompt,
      title,
      materials_csv,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).send("Database error");
    }

    return res.status(200).json({ message: "Saved successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("Internal server error");
  }
}
