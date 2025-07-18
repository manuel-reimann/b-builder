import { createClient } from "@supabase/supabase-js";

console.log("ENV SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("ENV SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId, image_url, prompt, title, materials_csv } = await req.json();

    console.log("userId:", userId);
    console.log("image_url:", image_url);
    console.log("prompt:", prompt);
    console.log("title:", title);
    console.log("materials_csv:", materials_csv);

    if (!userId || !image_url || !prompt || !title || !materials_csv) {
      return new Response("Missing required fields", { status: 400 });
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
      return new Response("Database error", { status: 500 });
    }

    return new Response("Saved successfully", { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
