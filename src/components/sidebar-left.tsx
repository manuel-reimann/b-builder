import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

type ItemType = "element" | "sleeve";
type DataItem = { label: string; src: string; type: ItemType };
type Data = Record<string, DataItem[]>;

const data: Data = {
  Sleeves: [
    { label: "Kraft Tüte", src: "/img/sleeve1.png", type: "sleeve" },
    { label: "Transparent", src: "/img/sleeve2.png", type: "sleeve" },
    { label: "Pastell Rosa", src: "/img/sleeve3.png", type: "sleeve" },
  ],
  Rosen: [
    { label: "Red Naomi", src: "/img/rose-rot.png", type: "element" },
    { label: "White Avalanche", src: "/img/rose-weiss.png", type: "element" },
  ],
  Sprayrosen: [
    { label: "Spray Rosa", src: "/img/sprayrosa.png", type: "element" },
    { label: "Spray Gelb", src: "/img/spraygelb.png", type: "element" },
  ],
  Gypsophilla: [
    {
      label: "Gypsophilla Weiss",
      src: "/img/gypsophilla.png",
      type: "element",
    },
    {
      label: "Gypsophilla Rosa",
      src: "/img/gypsophilla-rosa.png",
      type: "element",
    },
  ],
  "Sri Lanka": [
    { label: "Palmblatt", src: "/img/palmblatt.png", type: "element" },
    { label: "Monstera", src: "/img/monstera.png", type: "element" },
  ],
  Stecker: [
    { label: "Herzstecker", src: "/img/herzstecker.png", type: "element" },
    { label: "Happy Birthday", src: "/img/stecker-hb.png", type: "element" },
  ],
  Chrysanthemen: [
    { label: "Santini Green", src: "/img/santini-green.png", type: "element" },
    { label: "Santini White", src: "/img/santini-white.png", type: "element" },
  ],
  Filler: [
    { label: "Eucalyptus", src: "/img/eukalyptus.png", type: "element" },
    { label: "Limonium", src: "/img/limonium.png", type: "element" },
  ],
};

export default function SidebarLeft({
  setCanvasItems,
  setSleeveSrc, // NEU
  canvasContainerRef,
}: {
  setCanvasItems: Function;
  setSleeveSrc: React.Dispatch<React.SetStateAction<string>>; // NEU
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const handleAddImage = (
    src: string,
    label: string,
    type: "element" | "sleeve" = "element"
  ) => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      const maxHeight = 150;
      const scale = Math.min(1, maxHeight / img.height);
      const randomOffset = () => Math.floor(Math.random() * 300) - 150;

      const newItem = {
        id: uuidv4(),
        src,
        label, // ← WICHTIG: muss hier übergeben werden
        x: 400 + randomOffset(),
        y: 300 + randomOffset(),
        rotation: 0,
        scale,
        maxWidth: maxHeight,
        maxHeight,
        type,
      };

      if (type === "sleeve") {
        // Bild im Hintergrund ersetzen
        setSleeveSrc(src);

        // Gleichzeitig auch den sleeve im canvasItems aktualisieren:
        setCanvasItems((prev: any[]) =>
          prev.map((item) =>
            item.type === "sleeve"
              ? { ...item, src, label } // 🔁 src & label ersetzen
              : item
          )
        );
      } else {
        setCanvasItems((prev: any[]) => [...prev, newItem]);
      }
    };
  };

  return (
    <Accordion type="multiple" className="space-y-4">
      {Object.entries(data).map(([category, items]) => (
        <AccordionItem
          value={category}
          key={category}
          className="border-b pb-2"
        >
          <AccordionTrigger className="text-lg font-semibold text-left w-full py-2">
            {category}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {items.map(({ label, src, type }) => (
                <div
                  key={label}
                  onClick={() => handleAddImage(src, label, type)}
                  className="cursor-pointer rounded border hover:shadow-md p-2 bg-white flex flex-col items-center text-center hover:bg-green-50"
                >
                  <img
                    src={src}
                    alt={label}
                    className="w-16 h-16 object-contain mb-1"
                  />
                  <span className="text-sm">{label.replace(/\.png$/, "")}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
