export async function generateImageWithFlux({
  prompt,
  imageBase64,
}: {
  prompt: string;
  imageBase64: string;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/flux", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image: imageBase64,
      }),
    });

    if (!res.ok) {
      console.error("Flux API error:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.image;
  } catch (error) {
    console.error("Flux API exception:", error);
    return null;
  }
}
