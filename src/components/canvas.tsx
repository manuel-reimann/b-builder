import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import StaticSleeveImage from "./static-sleeve-image";
import CanvasImage from "./canvas-image";

export interface CanvasItem {
  id: string;
  src: string;
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  rotation: number;
  scale: number;
  type?: "sleeve" | "element";
}

export default function Canvas({
  items,
  setCanvasItems,
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // ref für den Container
  const stageRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  // ResizeObserver, um Grösse zu messen
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

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
    <div ref={containerRef} className="w-full h-full">
      <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
        <Layer>
          <StaticSleeveImage
            canvasWidth={dimensions.width}
            canvasHeight={dimensions.height}
          />

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
