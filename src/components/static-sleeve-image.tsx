import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 800;

export default function StaticSleeveImage({ sleeveSrc }: { sleeveSrc: string }) {
  const [image] = useImage(sleeveSrc);
  const imageRef = useRef<any>(null);

  useEffect(() => {
    if (!image || !imageRef.current) return;

    // Skaliere Sleeve innerhalb des festen virtuellen Bereichs
    const scale = Math.min((DESIGN_WIDTH * 0.95) / image.width, (DESIGN_HEIGHT * 0.95) / image.height);

    // Zentriere innerhalb des virtuellen Bereichs
    imageRef.current.scale({ x: scale, y: scale });
    imageRef.current.position({
      x: (DESIGN_WIDTH - image.width * scale) / 2,
      y: (DESIGN_HEIGHT - image.height * scale) / 2,
    });
  }, [image]);

  if (!image) return null;

  return <KonvaImage image={image} ref={imageRef} />;
}
