import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CanvasItem } from "./canvas";

function iconForType(type: string): string {
  switch (type) {
    case "sleeve":
      return "📦";
    case "flower":
      return "🌹";
    case "sprayrose":
      return "💐";
    case "gypsophilla":
      return "🌾";
    case "srilanka":
      return "🌿";
    case "plug":
      return "🔖";
    case "chrysanthemum":
      return "🌼";
    case "filler":
      return "🍃";
    default:
      return " ";
  }
}

export default function SidebarRight({
  items,
  setCanvasItems,
  selectedItemId,
  setSelectedItemId,
  hoveredItemId,
  setHoveredItemId,
}: {
  items: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredItemId: string | null;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const sleeveItem = items.find((item) => item.type === "sleeve");
  const elementItems = items.filter((item) => item.type !== "sleeve");
  const reversedElementItems = [...elementItems].reverse(); // newest on top

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = reversedElementItems.findIndex((i) => i.id === active.id);
      const newIndex = reversedElementItems.findIndex((i) => i.id === over?.id);

      const reordered = arrayMove(reversedElementItems, oldIndex, newIndex).reverse();
      const updated = sleeveItem ? [sleeveItem, ...reordered] : reordered;
      setCanvasItems(updated);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Layers</h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={reversedElementItems.map((item) => item.id)} // Only draggable items
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {/* All sortable items */}
            {reversedElementItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={(id) => setCanvasItems((prev) => prev.filter((el) => el.id !== id))}
                onDuplicate={(item) => {
                  const duplicatedItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    x: item.x + 30,
                    y: item.y + 30,
                  };
                  setCanvasItems((prev) => [...prev, duplicatedItem]);
                }}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                hoveredItemId={hoveredItemId}
                setHoveredItemId={setHoveredItemId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Sleeve item is fixed at the bottom layer and rendered last */}
      {sleeveItem && (
        <div
          key={sleeveItem.id}
          className="px-3 py-2 mt-4 text-gray-500 bg-gray-100 border border-gray-300 rounded shadow-sm"
        >
          📦 {sleeveItem.label} (unterste Ebene)
        </div>
      )}
    </div>
  );
}
// Represents a draggable item in the right-side layer list, supporting select, hover, duplicate, and delete operations
function SortableItem({
  item,
  onDelete,
  onDuplicate,
  selectedItemId,
  setSelectedItemId,
  hoveredItemId,
  setHoveredItemId,
}: {
  item: CanvasItem;
  onDelete: (id: string) => void;
  onDuplicate: (item: CanvasItem) => void;
  selectedItemId: string | null;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredItemId: string | null;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  // Enables drag-and-drop functionality for the layer item
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  // Dynamically apply styles depending on drag state
  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    // Keep the item interactive while it's not being dragged
    pointerEvents: "auto",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => setSelectedItemId(item.id)}
      onMouseEnter={() => setHoveredItemId(item.id)}
      onMouseLeave={() => setHoveredItemId(null)}
      className={`border border-gray-300 px-3 py-2 rounded shadow-sm flex justify-between items-center cursor-pointer transition-colors duration-150 ${
        selectedItemId === item.id
          ? "ring-2 ring-blue-400 bg-white"
          : hoveredItemId === item.id
          ? "bg-blue-200"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2 text-sm truncate">
          <span>{iconForType(item.type)}</span>
          {item.label ||
            item.src
              .split("/")
              .pop()
              ?.replace(/\.[^/.]+$/, "")}
        </span>

        <div className="flex items-center gap-2 ml-4">
          {/* Duplicate button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(item);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
            className="p-0 text-lg text-gray-500 bg-transparent border-0 cursor-pointer hover:text-gray-700"
          >
            📄
          </button>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            type="button"
            className="p-0 text-lg text-red-600 bg-transparent border-0 cursor-pointer hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
