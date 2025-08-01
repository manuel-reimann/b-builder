/**
 * Utility to build a descriptive AI prompt based on selected canvas items.
 * Supports background-specific additions and controlled stacking of item snippets.
 */
import { CanvasItem } from "../components/canvas";

/**
 * Constructs the final prompt string.
 * @param items - Array of canvas items, each may include a promptAddition and stackable flag.
 * @returns Combined prompt for AI image generation.
 */
export function buildPrompt(items: CanvasItem[]): string {
  // Base prompt: always include this description to maintain core realism requirements
  const basePrompt = "Enhance the image to a photorealistic finish. Do not change the flower types, colors, number, positions or spacing, and do not add or remove any elements. Add only subtle shading and fine surface detail. Preserve the existing light direction and overall focus characteristics; reinforce gentle occlusion shadows where petals overlap.";

  // Prepare collections for prompt snippets:
  // - overrides: stores the latest snippet for non-stackable types (e.g., backgrounds, sleeves)
  // - stackers: accumulates snippets for stackable types (e.g., filler flowers)
  const overrides: Record<string, string> = {};
  const stackers: string[] = [];
  // Track which stackable types have been added to avoid duplicates
  const seenStackTypes: Set<string> = new Set();
  // Iterate through each item, collecting its prompt addition based on its stackable flag
  items.forEach((item) => {
    if (!item.promptAddition) return;
    if (item.stackable === false) {
      overrides[item.type] = item.promptAddition;
    } else {
      if (!seenStackTypes.has(item.type)) {
        stackers.push(item.promptAddition);
        seenStackTypes.add(item.type);
      }
    }
  });
  // Exclude background and sleeve overrides here; these are appended separately
  const overrideSnippets = Object.entries(overrides)
    .filter(([type]) => type !== "background" && type !== "sleeve")
    .map(([, snippet]) => snippet);
  const allSnippets = [...overrideSnippets, ...stackers];
  const uniqueSnippets = Array.from(new Set(allSnippets));
  console.log("DEBUG Prompt Overrides (sans BG/Sleeve):", overrideSnippets);
  console.log("DEBUG Prompt Stackers:", stackers);
  console.log("DEBUG All Snippets Before Dedup:", allSnippets);
  console.log("DEBUG Unique Snippets After Dedup:", uniqueSnippets);
  const combinedSnippets = uniqueSnippets.join(" ").trim();
  const snippetSegment = combinedSnippets ? ` ${combinedSnippets}` : "";

  // Return the base prompt concatenated with any custom snippet segment
  return basePrompt + snippetSegment;
}
