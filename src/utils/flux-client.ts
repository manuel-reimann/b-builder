export async function generateImageWithFlux({ imageBase64, prompt }: { imageBase64: string; prompt: string }) {
  const payload = {
    image: imageBase64,
    prompt,
  };

  console.log("Payload to /api/flux:", payload);

  const response = await fetch("/api/flux", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flux API error: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
