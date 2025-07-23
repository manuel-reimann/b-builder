// Import required libraries and components
import { generateImageWithFlux } from "../utils/flux-client"; // Import the Flux API client for image generation <------
import ResultModal from "./results-modal";
import { buildPrompt } from "../utils/export-prompt"; // Import the prompt builder utility
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import StaticSleeveImage from "./static-sleeve-image";
import CanvasImage from "./canvas-image";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase-client"; // Supabase client import
import "react-toastify/dist/ReactToastify.css";
//import { showToastOnceStrict } from "../lib/toastUtils"; // Import custom toast utility
//import { createClient } from "@supabase/supabase-js";

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
    | "filler" // Generic filler greens
    | "background"; // Optional background image
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
  hoveredItemId,
  setHoveredItemId,
  userId,
  setShowLoginModal,
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
  hoveredItemId: string | null;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Fixed design dimensions for the canvas
  const DESIGN_WIDTH = 800;
  const DESIGN_HEIGHT = 800;
  const containerRef = canvasContainerRef;
  // Reference to the Konva Stage component
  const stageRef = useRef<any>(null);

  const [resultModalProps, setResultModalProps] = useState({
    open: false,
    imageUrl: null as string | null,
    title: "",
  });

  // Track whether we should generate after saving draft
  const [shouldGenerateAfterDraft, setShouldGenerateAfterDraft] = useState(false);

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

  const backgroundItem = items.find((item) => item.type === "background");

  // Saves changes to an existing draft and shows a success toast
  function handleUpdateDraft() {
    if (saveDraft) {
      saveDraft();
      toast.success("Entwurf wurde aktualisiert!");
    } else {
      console.warn("saveDraft function not provided");
    }
  }

  // Handles the generation process (called after all preconditions are met)
  const handleGenerate = async () => {
    console.log("▶️ Starting image generation...");
    if (!stageRef.current) {
      console.error("Stage ref is not available");
      return;
    }

    let draftTitle: string = "Untitled";
    // If no draft exists, show warning and save it first, then re-fetch the latest draft for title/id
    if (!currentDraftId) {
      toast.warning("Bitte speichere zuerst deinen Entwurf, bevor du das Bild generierst.");
      await saveDraft();
      // Wait briefly to ensure Supabase has indexed the new draft
      await new Promise((resolve) => setTimeout(resolve, 300));

      // After saving, re-fetch the draft to get its ID and title
      const { data } = await supabase
        .from("user_drafts")
        .select("id, title")
        .order("created_at", { ascending: false })
        .limit(1);
      const latestDraft = data?.[0];
      draftTitle = latestDraft?.title ?? "Untitled";
      console.log("📛 Draft title used for modal and download:", draftTitle);
      setResultModalProps({
        open: true,
        imageUrl: null,
        title: draftTitle,
      });
    } else {
      // If we do have a draft, fetch its title from Supabase
      const { data } = await supabase.from("user_drafts").select("id, title").eq("id", currentDraftId).limit(1);
      const currentDraft = data?.[0];
      draftTitle = currentDraft?.title ?? "Untitled";
      console.log("📛 Draft title used for modal and download:", draftTitle);
      setResultModalProps({
        open: true,
        imageUrl: null,
        title: draftTitle,
      });
    }

    setSelectedItemId(null);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const canvasElement = stageRef.current.getStage().toCanvas();
    const dataUrl = canvasElement.toDataURL("image/png");

    const prompt = buildPrompt(items);
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

    const result = await generateImageWithFlux({ prompt, imageBase64: dataUrl });

    if (result && result.image) {
      try {
        const response = await fetch(result.image);
        const blob = await response.blob();
        const filename = `flux-output-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage.from("user-images").upload(filename, blob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/png",
        });

        if (uploadError) {
          toast.error("Upload to Supabase failed");
          return;
        }

        const { data: publicData } = supabase.storage.from("user-images").getPublicUrl(filename);

        if (!publicData?.publicUrl) {
          toast.error("Could not retrieve public URL");
          return;
        }

        const publicUrl = publicData.publicUrl;
        setResultModalProps((prev) => ({
          ...prev,
          imageUrl: publicUrl,
        }));

        await saveDesignToSupabase({
          userId,
          prompt,
          image_url: publicUrl,
          title: draftTitle,
          materials_csv,
        });

        toast.success("Design erfolgreich gespeichert!");
        console.log("✅ Image generation and save complete. ResultModal props:", {
          imageUrl: result.image,
          title: draftTitle,
        });
      } catch (error) {
        console.error("❗ Fehler beim gesamten Vorgang:", error);
        toast.error("Speichern fehlgeschlagen.");
      }
    } else {
      console.warn("No image returned from Flux:", result);
    }
  };

  // After draft is saved and we have an id, trigger generation if pending
  useEffect(() => {
    if (shouldGenerateAfterDraft && currentDraftId) {
      console.log("🧠 Generating after draft was saved...");
      handleGenerate();
      setShouldGenerateAfterDraft(false);
    }
  }, [shouldGenerateAfterDraft, currentDraftId]);

  // JSX structure of the canvas and control buttons
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full transition-all bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: backgroundItem ? `url(${backgroundItem.src})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
      {/* Displays the current draft title if available (fallback to '(Ohne Titel)') */}
      {resultModalProps.title && (
        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/80 text-sm font-semibold rounded shadow-md text-gray-800">
          Aktueller Entwurf: {resultModalProps.title || "(Ohne Titel)"}
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
          {items.map(
            (item) =>
              item.type !== "background" && (
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
              )
          )}
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
                if (userId) {
                  showSaveDraftModal();
                } else {
                  toast.info("Please login first");
                  setShowLoginModal(true);
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-blue hover:bg-gray-500 rounded-md"
            >
              💾 <span>Save draft</span>
            </button>
          )}
          {/* Button to reset canvas to only the sleeve background */}
          <button
            onClick={() => {
              const filtered = items.filter((item) => item.type === "sleeve" || item.type === "background");
              setCanvasItems(filtered);
              setSelectedItemId(null);
              toast.info("Canvas was reset");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white bg-agrotropic-gray hover:bg-gray-400 rounded-md"
          >
            ♻️ <span>Reset</span>
          </button>
          {/* Button to trigger generation action (with disabled and toast logic) */}
          <button
            onClick={() => {
              if (!userId) {
                toast.info("Please login first");
                setShowLoginModal(true);
                return;
              }
              if (!currentDraftId) {
                toast.info("Bitte speichere zuerst deinen Entwurf.");
                return;
              }
              handleGenerate();
            }}
            disabled={!currentDraftId}
            className={`flex items-center gap-2 px-3 py-1.5 text-lg font-medium text-white rounded-md ${
              !currentDraftId ? "bg-gray-300 cursor-not-allowed" : "bg-agrotropic-green hover:bg-green-900"
            }`}
          >
            🎨 <span>Generate</span>
          </button>
        </div>
      </div>
      <ResultModal
        key={`${resultModalProps.imageUrl}-${resultModalProps.title}`} // Ensures modal remounts on new image and title
        open={resultModalProps.open}
        onClose={() => setResultModalProps((prev) => ({ ...prev, open: false }))}
        imageUrl={resultModalProps.imageUrl}
        title={resultModalProps.title}
      />
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
