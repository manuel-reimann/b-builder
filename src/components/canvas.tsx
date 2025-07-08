// Import required libraries and components
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import StaticSleeveImage from "./static-sleeve-image";
import CanvasImage from "./canvas-image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Defines the structure of each item placed on the canvas
export interface CanvasItem {
  id: string; // Unique identifier for the item
  src: string; // Image source URL
  x: number; // X position on canvas
  y: number; // Y position on canvas
  maxWidth: number; // Maximum width the image can scale to
  maxHeight: number; // Maximum height the image can scale to
  rotation: number; // Rotation angle in degrees
  scale: number; // Scale factor (1 = original size)
  type:
    | "sleeve" // The background sleeve layer
    | "roses" // Main roses
    | "sprayrose" // Spray roses
    | "gypsophilla" // Gypsophilla flowers
    | "Sri Lanka" // Special foliage category
    | "plug" // Flower plugs or accessories
    | "chrysanthemum" // Chrysanthemums
    | "filler"; // Generic filler greens
  sleeveSrc: string; // Optional separate sleeve source (only used for sleeve-type)
  label?: string; // Optional label for display
}

// Main Canvas component responsible for rendering the canvas and managing items
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
  // Tracks the currently selected item ID within the canvas
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Fixed design dimensions for the canvas
  const DESIGN_WIDTH = 800;
  const DESIGN_HEIGHT = 800;
  const containerRef = canvasContainerRef;
  // Reference to the Konva Stage component
  const stageRef = useRef<any>(null);

  // Tracks the current width and height of the canvas container
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  // Dynamically track the size of the canvas container and update dimensions accordingly
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

  // Listens for the Delete key to remove non-sleeve items from the canvas
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
  // Enables keyboard deletion support by binding handleDelete to keydown event
  useEffect(() => {
    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [selectedId, items]);

  // Calculate scaling factors to keep canvas content proportional and centered
  const scaleX = dimensions.width / DESIGN_WIDTH;
  const scaleY = dimensions.height / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  // Saves changes to an existing draft and shows a success toast
  function handleUpdateDraft() {
    if (saveDraft) {
      saveDraft();
      toast.success("Entwurf wurde aktualisiert!");
    } else {
      console.warn("saveDraft function not provided");
    }
  }

  // JSX structure of the canvas and control buttons
  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Displays the current draft name if available */}
      {currentDraftTitle && (
        <div className="fixed z-20 px-3 py-1 text-sm text-gray-700 rounded shadow top-4 left-4 bg-white/80">
          <div>Aktueller Entwurf:</div>
          <div className="font-semibold">{currentDraftTitle}</div>
        </div>
      )}
      {/* Konva Stage: The main container for canvas rendering */}
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={(dimensions.width - DESIGN_WIDTH * scale) / 2}
        y={(dimensions.height - DESIGN_HEIGHT * scale) / 2}
        ref={stageRef}
      >
        {/* Konva Layer: Layer to hold all canvas items */}
        <Layer>
          {/* StaticSleeveImage: Renders the background sleeve image */}
          <StaticSleeveImage sleeveSrc={sleeveSrc} />
          {/* CanvasImage components: Render each item on the canvas */}
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

      <div className="fixed z-10 bottom-[2vh] right-[20vw]">
        <div className="flex gap-3 p-2 border border-gray-300 rounded-lg shadow-md bg-white/80 backdrop-blur-sm">
          {/* Button to update an existing draft */}
          {currentDraftId ? (
            <button
              onClick={handleUpdateDraft}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-blue-100 hover:bg-blue-200 rounded-md"
            >
              Update Draft
            </button>
          ) : (
            /* Button to open modal for saving a new draft */
            <button
              onClick={() => {
                showSaveDraftModal();
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-blue hover:bg-gray-500 rounded-md"
            >
              💾 <span>Save draft</span>
            </button>
          )}
          {/* Button to reset canvas to only the sleeve background */}
          <button
            onClick={() => {
              const filtered = items.filter((item) => item.type === "sleeve");
              setCanvasItems(filtered);
              setSelectedItemId(null);
              toast.info("Canvas wurde zurückgesetzt");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-gray hover:bg-gray-400 rounded-md"
          >
            ♻️ <span>Reset</span>
          </button>
          {/* Button to trigger generation action (currently logs to console) */}
          <button
            onClick={() => {
              console.log("Generate clicked");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-green hover:bg-green-900 rounded-md"
          >
            🎨 <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
