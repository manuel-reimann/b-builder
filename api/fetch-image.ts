export const config = {
  runtime: "edge",
};

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing 'url' parameter", { status: 400 });
  }

  try {
    const externalRes = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      redirect: "follow",
    });

    if (!externalRes.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    const contentType = externalRes.headers.get("content-type") || "image/png";
    const buffer = await externalRes.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Content-Disposition": "inline; filename=image.png",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*", // Optional: relax CORS for testing
      },
    });
  } catch (err) {
    return new Response("Error fetching image: " + (err as Error).message, { status: 500 });
  }
}
