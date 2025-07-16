export async function generateImageWithFlux({
  imageBase64,
  prompt,
  userId,
  title,
  materials_csv,
}: {
  imageBase64: string;
  prompt: string;
  userId: string;
  title: string;
  materials_csv: string;
}) {
  const response = await fetch("/api/flux", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      userId,
      title,
      materials_csv,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flux API error: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
