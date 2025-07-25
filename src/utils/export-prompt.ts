import { CanvasItem } from "../components/canvas";

export function buildPrompt(items: CanvasItem[]): string {
  const basePrompt =
    "Update the image, make it more realistic. Do not change the existing colors of flowers or assets in any way. You may add shading, leaves or stems behind the heads to make it more realistic. Goal is a photorealistic looking bouquet without changing the original flowers.";

  // Collect prompt additions with stackable control
  const overrides: Record<string, string> = {};
  const stackers: string[] = [];
  items.forEach((item) => {
    if (!item.promptAddition) return;
    if (item.stackable === false) {
      overrides[item.type] = item.promptAddition;
    } else {
      stackers.push(item.promptAddition);
    }
  });
  const combinedSnippets = [...Object.values(overrides), ...stackers].join(" ");
  const snippetSegment = combinedSnippets ? ` ${combinedSnippets}` : "";

  return basePrompt + snippetSegment;
}
