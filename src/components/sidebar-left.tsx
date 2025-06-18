import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

const data = {
  Sleeves: [
    { label: "Kraft Tüte", src: "/img/sleeve1.png" },
    { label: "Transparent", src: "/img/sleeve2.png" },
    { label: "Pastell Rosa", src: "/img/sleeve3.png" },
  ],
  Rosen: [
    { label: "Red Naomi", src: "/img/rose-rot.png" },
    { label: "White Avalanche", src: "/img/rose-weiss.png" },
  ],
  Sprayrosen: [
    { label: "Spray Rosa", src: "/img/sprayrosa.png" },
    { label: "Spray Gelb", src: "/img/spraygelb.png" },
  ],
  Gypsophilla: [
    { label: "Gypsophilla Weiss", src: "/img/gypsophilla.png" },
    { label: "Gypsophilla Rosa", src: "/img/gypsophilla-rosa.png" },
  ],
  "Sri Lanka": [
    { label: "Palmblatt", src: "/img/palmblatt.png" },
    { label: "Monstera", src: "/img/monstera.png" },
  ],
  Stecker: [
    { label: "Herzstecker", src: "/img/herzstecker.png" },
    { label: "Happy Birthday", src: "/img/stecker-hb.png" },
  ],
  Chrysanthemen: [
    { label: "Santini Green", src: "/img/santini-green.png" },
    { label: "Santini White", src: "/img/santini-white.png" },
  ],
  Filler: [
    { label: "Eucalyptus", src: "/img/eukalyptus.png" },
    { label: "Limonium", src: "/img/limonium.png" },
  ],
};

export default function SidebarLeft({
  setCanvasItems,
  canvasContainerRef,
}: {
  setCanvasItems: Function;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const handleAddImage = (src: string) => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      const maxHeight = 150;
      const scale = Math.min(1, maxHeight / img.height);

      // einfache zufällige Position rund um die Bildmitte (ca. 400x400)
      const randomOffset = () => Math.floor(Math.random() * 300) - 150;

      const newItem = {
        id: uuidv4(),
        src,
        x: 400 + randomOffset(),
        y: 300 + randomOffset(),
        rotation: 0,
        scale,
        maxWidth: maxHeight,
        maxHeight,
        type: "element",
      };

      setCanvasItems((prev: any[]) => [...prev, newItem]);
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
              {items.map(({ label, src }) => (
                <div
                  key={label}
                  onClick={() => handleAddImage(src)}
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
