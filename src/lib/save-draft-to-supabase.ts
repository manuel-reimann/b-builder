import { createClient } from "@supabase/supabase-js";
console.log("INIT SUPABASE vo save-draft-to-supabase.ts", import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * Saves a draft to Supabase. If a draftId is provided, it updates the existing draft.
 *
 * Ensure your `user_drafts` table includes columns:
 *   id (uuid), user_id (uuid), title (text), elements (jsonb), sleeve (text)
 *
 * @param userId The Supabase user ID
 * @param items Array of canvas items (elements and sleeve)
 * @param sleeveSrc Path to the sleeve image
 * @param title Optional title to assign (if new draft)
 * @param draftId Optional ID of existing draft to update
 * @returns { success: boolean, newDraftId?: string }
 */
export async function saveDraftToSupabase(
  userId: string,
  items: any[],
  sleeveSrc: string,
  title?: string,
  draftId?: string
): Promise<{ success: boolean; newDraftId?: string }> {
  try {
    // Only include fields that exist in the Supabase schema for user_drafts:
    // user_id, title, elements, sleeve
    const basePayload = {
      user_id: userId,
      elements: JSON.parse(JSON.stringify(items)),
      sleeve: sleeveSrc,
    };

    const insertPayload = {
      ...basePayload,
      title: title?.trim() || "Untitled",
    };

    const updatePayload = {
      ...basePayload,
      ...(title && title.trim() ? { title: title.trim() } : {}),
    };

    let response;

    if (draftId) {
      response = await supabase.from("user_drafts").update(updatePayload).eq("id", draftId).eq("user_id", userId);
    } else {
      response = await supabase.from("user_drafts").insert(insertPayload).select("id").single();
    }

    if (response.error) {
      console.error("Supabase error while saving draft:", response.error);
      return { success: false };
    }

    const newId = response.data?.id;
    return { success: true, newDraftId: newId };
  } catch (err) {
    console.error("Unexpected error while saving draft:", err);
    return { success: false };
  }
}
