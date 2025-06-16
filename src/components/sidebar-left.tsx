import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

const data = {
  Rosen: [
    { label: "Rose rot", src: "/img/rose-rot.png" },
    { label: "Rose weiss", src: "/img/rose-weiss.png" },
  ],
  Sprayrosen: [
    { label: "Sprayrosa", src: "/img/sprayrosa.png" },
    { label: "Spraygelb", src: "/img/spraygelb.png" },
  ],
  "Sri Lanka Grün": [
    { label: "Palmblatt", src: "/img/palmblatt.png" },
    { label: "Monstera", src: "/img/monstera.png" },
  ],
  Spezielles: [
    { label: "Trockenblume", src: "/img/trockenblume.png" },
    { label: "Federn", src: "/img/federn.png" },
  ],
};

export default function Sidebar({
  setCanvasItems,
}: {
  setCanvasItems: Function;
}) {
  const handleAddImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const maxHeight = 150;
      const scale = Math.min(1, maxHeight / img.height);
      const newItem = {
        id: uuidv4(),
        src,
        x: 100,
        y: 100,
        rotation: 0,
        scale,
        maxWidth: maxHeight,
        maxHeight,
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
            <div className="flex flex-wrap gap-2 mt-2">
              {items.map(({ label, src }) => (
                <button
                  key={label}
                  onClick={() => handleAddImage(src)}
                  className="bg-green-300 text-white px-3 py-2 rounded hover:bg-green-400 transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
