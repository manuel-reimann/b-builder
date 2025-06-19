import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CanvasItem } from "./canvas";
import { useEffect, useState } from "react";

export default function SidebarRight({
  items,
  setCanvasItems,
  selectedItemId,
  setSelectedItemId,
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const sleeveItem = items.find((item) => item.type === "sleeve");
  const elementItems = items.filter((item) => item.type !== "sleeve");
  const reversedElementItems = [...elementItems].reverse(); // neueste oben
  const dragItems = sleeveItem
    ? [...reversedElementItems, sleeveItem]
    : reversedElementItems;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = reversedElementItems.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = reversedElementItems.findIndex((i) => i.id === over?.id);

      const reordered = arrayMove(
        reversedElementItems,
        oldIndex,
        newIndex
      ).reverse();
      const updated = sleeveItem ? [sleeveItem, ...reordered] : reordered;
      setCanvasItems(updated);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Layers</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={reversedElementItems.map((item) => item.id)} // Nur verschiebbare Items
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {/* Alle Sortable Items */}
            {reversedElementItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={(id) =>
                  setCanvasItems((prev) => prev.filter((el) => el.id !== id))
                }
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ❗ Sleeve-Element immer separat ganz unten */}
      {sleeveItem && (
        <div
          key={sleeveItem.id}
          className="mt-4 bg-gray-100 text-gray-500 border border-gray-300 px-3 py-2 rounded shadow-sm"
        >
          {sleeveItem.label} (unterste Ebene)
        </div>
      )}
    </div>
  );
}
// Typanpassung & Übergabe der Löschfunktion
function SortableItem({
  item,
  onDelete,
  selectedItemId,
  setSelectedItemId,
}: {
  item: CanvasItem;
  onDelete: (id: string) => void;
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  // useSortable liefert Props für Drag&Drop, die du auf den Hauptcontainer packen musst
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  // Setze transform/transition für Drag Animation
  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    pointerEvents: "auto", // jetzt korrekt getypt
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => setSelectedItemId(item.id)}
      className={`bg-white border border-gray-300 px-3 py-2 rounded shadow-sm flex justify-between items-center cursor-pointer ${
        selectedItemId === item.id ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <span className="text-sm truncate">
        {item.label ||
          item.src
            .split("/")
            .pop()
            ?.replace(/\.[^/.]+$/, "")}
      </span>

      {/* Button, der Drag-Events stoppt und somit klickbar bleibt */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // verhindern, dass Klick den Drag triggert
          onDelete(item.id);
        }}
        onPointerDown={(e) => e.stopPropagation()} // verhindert Drag-Start auf Button
        type="button"
        className="ml-2 text-red-600 hover:text-red-800 bg-transparent border-0 text-xl p-0 cursor-pointer"
      >
        🗑️
      </button>
    </div>
  );
}
