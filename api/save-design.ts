import { createClient } from "@supabase/supabase-js";

console.log("INIT SUPABASE", import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient(process.env.VITE_!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId, image, prompt, title, materials_csv } = await req.json();

    if (!userId || !image || !prompt || !title || !materials_csv) {
      return new Response("Missing required fields", { status: 400 });
    }

    const { error } = await supabase.from("user_designs").insert({
      user_id: userId,
      image_url: image,
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
