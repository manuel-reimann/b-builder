// Import required libraries and components
//import { generateImageWithFlux } from "../utils/flux-client"; wider aktiviere nacher <-------
import { buildPrompt } from "../utils/export-prompt"; // Import the prompt builder utility
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
  hoveredItemId,
  setHoveredItemId,
  userId,
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
  hoveredItemId: string | null;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
}) {
  // Fixed design dimensions for the canvas
  const DESIGN_WIDTH = 800;
  const DESIGN_HEIGHT = 800;
  const containerRef = canvasContainerRef;
  // Reference to the Konva Stage component
  const stageRef = useRef<any>(null);

  const [fluxImage, setFluxImage] = useState<string | null>(null);

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

  // Listens for the Delete or Backspace key to remove non-sleeve items from the canvas
  const handleDelete = (e: KeyboardEvent) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedItemId) {
      const itemToDelete = items.find((item) => item.id === selectedItemId);

      if (itemToDelete?.type !== "sleeve") {
        const filtered = items.filter((item) => item.id !== selectedItemId);

        setCanvasItems(filtered);
        setSelectedItemId(null);
      }
    }
  };
  // Enables keyboard deletion support by binding handleDelete to keydown event
  useEffect(() => {
    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [selectedItemId, items]);

  // Calculate scaling to keep canvas content proportional and centered
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
    <div
      ref={containerRef}
      className="relative w-full h-full transition-all bg-center bg-no-repeat bg-cover"
      onDragOver={(e) => e.preventDefault()} // Allow drop
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;

        const { src, label, type } = JSON.parse(data);

        const boundingRect = containerRef.current?.getBoundingClientRect();
        if (!boundingRect) return;

        // Use a transparent ghost image to suppress browser default previews
        const transparentImg = new Image();
        transparentImg.src =
          "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
        document.body.appendChild(transparentImg);
        e.dataTransfer.setDragImage(transparentImg, 0, 0);
        setTimeout(() => {
          document.body.removeChild(transparentImg);
        }, 0);

        let x = (e.clientX - boundingRect.left - (dimensions.width - DESIGN_WIDTH * scale) / 2) / scale;
        let y = (e.clientY - boundingRect.top - (dimensions.height - DESIGN_HEIGHT * scale) / 2) / scale;

        const img = new window.Image();
        img.src = src;

        img.onload = () => {
          const maxHeight = 150;
          const scaleFactor = Math.min(1, maxHeight / img.height);
          const scaledWidth = img.width * scaleFactor;
          const scaledHeight = img.height * scaleFactor;

          // Adjust x and y so that the image is centered under the mouse
          x -= scaledWidth / 2;
          y -= scaledHeight / 2;

          const newItem: CanvasItem = {
            id: crypto.randomUUID(),
            src,
            label,
            x,
            y,
            rotation: 0,
            scale: scaleFactor,
            maxWidth: maxHeight,
            maxHeight,
            type,
            sleeveSrc: "",
          };

          setCanvasItems((prev) => [...prev, newItem]);
        };
      }}
    >
      {/* Displays the current draft name if available */}
      {currentDraftTitle && (
        <div className="absolute z-20 px-3 py-1 text-sm text-gray-700 rounded shadow top-4 left-4 bg-white/90">
          <div>Current Draft:</div>
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
        onMouseDown={(e) => {
          // Deselect if background or StaticSleeveImage ("sleeve") is clicked
          if (e.target === e.target.getStage() || e.target.name() === "sleeve") {
            setSelectedItemId(null);
          }
        }}
      >
        {/* Konva Layer: Holds all canvas elements including sleeve and draggable items */}
        <Layer>
          {/* StaticSleeveImage: Renders the background sleeve image */}
          <StaticSleeveImage sleeveSrc={sleeveSrc} />
          {/* CanvasImage components: Render each item on the canvas */}
          {items.map((item) => (
            <CanvasImage
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              isHovered={item.id === hoveredItemId && selectedItemId === null}
              onSelect={(id) => setSelectedItemId(id)}
              onHover={(id) => setHoveredItemId(id)}
              onUnhover={() => setHoveredItemId(null)}
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
              toast.info("Canvas was reset");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-gray hover:bg-gray-400 rounded-md"
          >
            ♻️ <span>Reset</span>
          </button>
          {/* Button to trigger generation action (currently logs to console) */}
          <button
            onClick={async () => {
              if (!stageRef.current) {
                console.error("Stage ref is not available");
                return;
              }

              // Deselect any selected element to remove transformation handles
              setSelectedItemId(null);
              await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for UI to update

              const canvasElement = stageRef.current.getStage().toCanvas();
              const dataUrl = canvasElement.toDataURL("image/png");

              const prompt = buildPrompt(items);
              console.log("DEBUG – Prompt:", prompt);
              console.log("DEBUG – Image length:", dataUrl.length);

              // Generate CSV string of materials
              const materialEntries = items.map(
                (item) =>
                  item.label ||
                  item.src
                    .split("/")
                    .pop()
                    ?.replace(/\.[^/.]+$/, "") ||
                  ""
              );
              const materials_csv = materialEntries.join(", ");

              // Call Flux API with only prompt and imageBase64
              // const result = await generateImageWithFlux({
              //   prompt,
              //   imageBase64: dataUrl,
              // });
              const result = { image: "/img/dummy-flux-output.jpg" }; // Dummy image for testing

              // After receiving result, save to Supabase
              if (result && result.image) {
                setFluxImage(result.image);

                try {
                  await saveDesignToSupabase({
                    userId,
                    prompt,
                    image_url: result.image,
                    title: currentDraftTitle ?? "Untitled",
                    materials_csv,
                  });
                  toast.success("Design erfolgreich gespeichert!");
                } catch (error) {
                  console.error("Fehler beim Speichern in Supabase:", error);
                  toast.error("Speichern fehlgeschlagen.");
                }
              } else {
                console.warn("No image returned from Flux:", result);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-green hover:bg-green-900 rounded-md"
          >
            🎨 <span>Generate</span>
          </button>
        </div>
      </div>

      {fluxImage && (
        <div className="absolute z-30 p-4 rounded shadow bottom-4 left-4 bg-white/90">
          <div className="mb-2 font-semibold text-gray-800">Preview (Flux Output):</div>
          <img src={fluxImage} alt="Flux Result" className="max-w-xs border border-gray-300 rounded" />
          <a href={fluxImage} download="flux_output.png" className="inline-block mt-2 text-sm text-blue-600 underline">
            Bild herunterladen
          </a>
        </div>
      )}
    </div>
  );
}

async function saveDesignToSupabase({
  userId,
  image_url,
  prompt,
  title,
  materials_csv,
}: {
  userId: string;
  image_url: string;
  prompt: string;
  title: string;
  materials_csv: string;
}) {
  const response = await fetch("/api/save-design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      image_url,
      prompt,
      title,
      materials_csv,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}
