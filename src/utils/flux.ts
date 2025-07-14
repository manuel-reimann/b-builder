export async function generateImageWithFlux({
  imageBase64,
  prompt,
}: {
  imageBase64: string;
  prompt: string;
}): Promise<string | null> {
  try {
    const response = await fetch("https://bfl.ai/api/flux-kontext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // optional: Auth-Header falls du einen Key brauchst
        // "Authorization": "Bearer YOUR_KEY_HERE",
      },
      body: JSON.stringify({
        prompt,
        image: imageBase64,
        guidance: 8, // kannst du anpassen
        model: "flux-kontext-v1", // je nach API-Anbieter
        seed: Math.floor(Math.random() * 100000),
      }),
    });

    if (!response.ok) throw new Error("Flux API request failed");

    const data = await response.json();
    return data.image_url || null;
  } catch (error) {
    console.error("Flux API error:", error);
    return null;
  }
}
