import { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { CanvasItem } from "./canvas";

export default function CanvasImage({
  item,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onUnhover,
  onChange,
}: {
  item: CanvasItem;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onUnhover: () => void;
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

    if ((isSelected || isHovered) && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image, isSelected, isHovered]);

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
        onClick={() => onSelect(item.id)}
        onTap={() => onSelect(item.id)}
        onDragEnd={(e) => {
          onSelect(item.id);
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          onChange({
            scale: node.scaleX(),
            rotation: node.rotation(),
          });
        }}
        onMouseEnter={() => {
          onHover(item.id);
          const stage = shapeRef.current?.getStage();
          if (stage) {
            stage.container().style.cursor = "pointer";
          }
        }}
        onMouseLeave={() => {
          onUnhover();
          const stage = shapeRef.current?.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
        strokeEnabled={false}
        shadowEnabled={false}
        perfectDrawEnabled={false}
        imageSmoothingEnabled={false}
      />
      {(isSelected || isHovered) && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
}
