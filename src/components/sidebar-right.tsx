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
          items={reversedElementItems.map((item) => item.id)} // Nur verschiebbare Items
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {/* Alle Sortable Items */}
            {reversedElementItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={(id) => setCanvasItems((prev) => prev.filter((el) => el.id !== id))}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* sleeve item is always at the bottom and the last element */}
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
// change of type & handover of delete function
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

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
      <span className="flex items-center gap-2 text-sm truncate">
        <span>{iconForType(item.type)}</span>
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
        className="p-0 ml-2 text-xl text-red-600 bg-transparent border-0 cursor-pointer hover:text-red-800"
      >
        🗑️
      </button>
    </div>
  );
}
