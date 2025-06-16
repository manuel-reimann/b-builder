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
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
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
          items={reversedElementItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {reversedElementItems.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}

            {sleeveItem && (
              <div className="bg-gray-100 text-gray-500 border border-gray-300 px-3 py-2 rounded shadow-sm">
                {sleeveItem.src.split("/").pop()} (nicht verschiebbar)
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ item }: { item: CanvasItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white border border-gray-300 px-3 py-2 rounded shadow-sm cursor-move flex justify-between items-center"
    >
      <span className="text-sm truncate">{item.src.split("/").pop()}</span>
    </div>
  );
}
