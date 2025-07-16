export async function generateImageWithFlux({ imageBase64, prompt }: { imageBase64: string; prompt: string }) {
  const response = await fetch("/api/flux", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flux API error: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
