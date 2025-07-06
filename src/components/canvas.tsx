import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import StaticSleeveImage from "./static-sleeve-image";
import CanvasImage from "./canvas-image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  sleeveSrc: string;
  label?: string;
}

export default function Canvas({
  items,
  setCanvasItems,
  selectedItemId,
  setSelectedItemId,
  canvasContainerRef,
  sleeveSrc,
  saveDraft,
  showSaveDraftModal,
  currentDraftId,
  currentDraftTitle,
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  sleeveSrc: string;
  saveDraft: () => Promise<void>;
  showSaveDraftModal: () => void;
  currentDraftId: string | null;
  currentDraftTitle: string | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Fixe Referenzgrösse für das Design
  const DESIGN_WIDTH = 800;
  const DESIGN_HEIGHT = 800;
  const containerRef = canvasContainerRef;
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
      const itemToDelete = items.find((item) => item.id === selectedId);

      if (itemToDelete?.type !== "sleeve") {
        const filtered = items.filter((item) => item.id !== selectedId);

        setCanvasItems(filtered);
        setSelectedId(null);
      } else {
        console.log("Löschen nicht erlaubt für sleeve.");
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [selectedId, items]);

  const scaleX = dimensions.width / DESIGN_WIDTH;
  const scaleY = dimensions.height / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  function handleUpdateDraft() {
    if (saveDraft) {
      saveDraft();
      toast.success("Entwurf wurde aktualisiert!");
    } else {
      console.warn("saveDraft function not provided");
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {currentDraftTitle && (
        <div className="absolute z-20 px-3 py-1 text-sm text-gray-700 rounded shadow top-4 left-4 bg-white/80">
          Aktueller Entwurf: {currentDraftTitle}
        </div>
      )}
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={(dimensions.width - DESIGN_WIDTH * scale) / 2}
        y={(dimensions.height - DESIGN_HEIGHT * scale) / 2}
        ref={stageRef}
      >
        <Layer>
          <StaticSleeveImage sleeveSrc={sleeveSrc} />

          {items.map((item) => (
            <CanvasImage
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              onSelect={(id) => setSelectedItemId(id)}
              onChange={(newAttrs) => {
                const updated = items.map((it) => (it.id === item.id ? { ...it, ...newAttrs } : it));
                setCanvasItems(updated);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div className="absolute z-10 bottom-4 right-[20vw]">
        <div className="flex gap-3 p-2 border border-gray-300 rounded-lg shadow-md bg-white/80 backdrop-blur-sm">
          {currentDraftId ? (
            <button
              onClick={handleUpdateDraft}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-blue-100 hover:bg-blue-200 rounded-md"
            >
              Update Draft
            </button>
          ) : (
            <button
              onClick={() => {
                showSaveDraftModal();
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-green-100 hover:bg-green-200 rounded-md"
            >
              Save Draft
            </button>
          )}
          <button
            onClick={() => {
              setCanvasItems((prev) => prev.filter((item) => item.type !== "element"));
              setSelectedItemId(null);
              toast.info("Canvas wurde zurückgesetzt");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md"
          >
            ♻️ <span>Reset</span>
          </button>
          <button
            onClick={() => {
              console.log("Generate clicked");
              // Placeholder: Add your generate image logic here
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md"
          >
            🎨 <span>Generate</span>
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
