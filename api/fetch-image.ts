export const config = {
  runtime: "edge", // optional bei Vercel
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response("Missing imageUrl", { status: 400 });
    }

    const externalRes = await fetch(imageUrl);
    if (!externalRes.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    const contentType = externalRes.headers.get("content-type") || "image/png";
    const buffer = await externalRes.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline; filename=image.png",
        "Access-Control-Allow-Origin": "*", // nur falls du auch lokal testen willst
      },
    });
  } catch (err) {
    return new Response("Error fetching image: " + (err as Error).message, { status: 500 });
  }
}
