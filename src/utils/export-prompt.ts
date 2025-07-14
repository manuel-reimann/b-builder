import { CanvasItem } from "../components/canvas";

export function buildPrompt(items: CanvasItem[]): string {
  const basePrompt =
    "Update the image, make it more realistic. Do not change the existing colors of flowers or assets in any way. You may add shading, leaves or stems behind the heads to make it more realistic. Goal is a photorealistic looking bouquet without changing the original flowers.";

  // Analyze item types for potential enhancement
  const itemTypes = items.map((item) => item.type).join(", ");
  const hint = itemTypes ? ` Elements used: ${itemTypes}.` : "";

  return basePrompt + hint;
}
