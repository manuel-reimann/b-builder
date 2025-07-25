/**
 * Utility to build a descriptive AI prompt based on selected canvas items.
 * Supports background-specific additions and controlled stacking of item snippets.
 */
import { CanvasItem } from "../components/canvas";

/**
 * Constructs the final prompt string.
 * @param items - Array of canvas items, each may include a promptAddition and stackable flag.
 * @param backgroundPromptAddition - Optional snippet specific to the chosen background.
 * @returns Combined prompt for AI image generation.
 */
export function buildPrompt(items: CanvasItem[], backgroundPromptAddition?: string): string {
  // Base prompt: always include this description to maintain core realism requirements
  const basePrompt =
    "Update the image, make it more realistic. Do not change the existing colors of flowers or assets in any way. You may add shading, leaves or stems behind the heads to make it more realistic. Goal is a photorealistic looking bouquet without changing the original flowers.";

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
  // Build the final array of snippets, starting with background if provided, then overrides, then stackers
  const combinedSnippetsArray: string[] = [];
  if (backgroundPromptAddition) {
    combinedSnippetsArray.push(backgroundPromptAddition);
  }
  combinedSnippetsArray.push(...Object.values(overrides), ...stackers);
  // Join all collected snippets into a single string, trimming extra spaces
  const combinedSnippets = combinedSnippetsArray.join(" ").trim();
  const snippetSegment = combinedSnippets ? ` ${combinedSnippets}` : "";

  // Return the base prompt concatenated with any custom snippet segment
  return basePrompt + snippetSegment;
}
