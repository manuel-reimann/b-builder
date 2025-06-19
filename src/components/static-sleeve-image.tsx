import React, { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export default function StaticSleeveImage({
  canvasWidth,
  canvasHeight,
  sleeveSrc,
}: {
  canvasWidth: number;
  canvasHeight: number;
  sleeveSrc: string;
}) {
  const [image] = useImage(sleeveSrc);
  const imageRef = useRef<any>(null);

  useEffect(() => {
    if (!image || !imageRef.current) return;

    const scale = Math.min(
      (canvasWidth * 0.95) / image.width,
      (canvasHeight * 0.95) / image.height
    );

    imageRef.current.scale({ x: scale, y: scale });
    imageRef.current.position({
      x: (canvasWidth - image.width * scale) / 2,
      y: (canvasHeight - image.height * scale) / 2,
    });
  }, [image, canvasWidth, canvasHeight]);

  if (!image) return null;

  return <KonvaImage image={image} ref={imageRef} />;
}
