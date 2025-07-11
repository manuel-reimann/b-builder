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

    // Scale the sleeve image to fit within a virtual area
    const scale = Math.min((DESIGN_WIDTH * 0.9) / image.width, (DESIGN_HEIGHT * 0.95) / image.height);

    // Center the sleeve image within the virtual canvas
    imageRef.current.scale({ x: scale, y: scale });
    imageRef.current.position({
      x: (DESIGN_WIDTH - image.width * scale) / 2,
      y: (DESIGN_HEIGHT - image.height * scale) / 2,
    });
  }, [image]);

  if (!image) return null;

  // Render the static sleeve image and set a name for interaction logic
  return <KonvaImage image={image} ref={imageRef} name="sleeve" />;
}
