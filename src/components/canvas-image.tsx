import React, { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { CanvasItem } from "./canvas"; // oder separat exportieren, wenn du möchtest

export default function CanvasImage({
  item,
  isSelected,
  onSelect,
  onChange,
}: {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<CanvasItem>) => void;
}) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [image] = useImage(item.src);

  useEffect(() => {
    if (!image) return;

    const maxWidth = item.maxWidth || 150;
    const scaleFactor = Math.min(1, maxWidth / image.width);

    if (item.scale === 1) {
      onChange({ scale: scaleFactor });
    }

    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image, isSelected]);

  if (item.type === "sleeve") return null;

  return (
    <>
      <KonvaImage
        image={image}
        x={item.x}
        y={item.y}
        scaleX={item.scale}
        scaleY={item.scale}
        rotation={item.rotation}
        draggable
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          onChange({
            scale: node.scaleX(),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
}
