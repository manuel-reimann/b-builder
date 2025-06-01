import React, { useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

export interface CanvasItem {
  id: string;
  src: string;
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  rotation: number;
  scale: number;
}

export default function Canvas({
  items,
  setCanvasItems,
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const handleDelete = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedId) {
      setCanvasItems(items.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [selectedId, items]);

  return (
    <div className="w-full h-full">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
      >
        <Layer>
          {items.map((item) => (
            <CanvasImage
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
              onChange={(newAttrs) => {
                const updated = items.map((it) =>
                  it.id === item.id ? { ...it, ...newAttrs } : it
                );
                setCanvasItems(updated);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

function CanvasImage({
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

    // Automatische Skalierung beim ersten Laden
    const maxWidth = 150;
    const scaleFactor = Math.min(1, maxWidth / image.width);
    if (item.scale === 1) {
      onChange({ scale: scaleFactor });
    }

    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [image, isSelected]);

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
