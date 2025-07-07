import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

type ItemType = "flower" | "sprayrose" | "gypsophilla" | "srilanka" | "plug" | "chrysanthemum" | "filler" | "sleeve";
type DataItem = { label: string; src: string; type: ItemType };
type Data = Record<string, DataItem[]>;

const data: Data = {
  Sleeves: [
    { label: "Braun", src: "/img/sleeves/sleeve1.webp", type: "sleeve" },
    { label: "Blau", src: "/img/sleeves/sleeve2.webp", type: "sleeve" },
    { label: "Pink", src: "/img/sleeves/sleeve3.webp", type: "sleeve" },
    { label: "VM 961", src: "/img/sleeves/vm961.webp", type: "sleeve" },
    { label: "VM 968", src: "/img/sleeves/vm968.webp", type: "sleeve" },
    { label: "VM 1029", src: "/img/sleeves/vm1029.webp", type: "sleeve" },
    { label: "VM 1033", src: "/img/sleeves/vm1033.webp", type: "sleeve" },
  ],
  Roses: [
    { label: "Aly", src: "/img/roses/aly.webp", type: "flower" },
    { label: "Aurora", src: "/img/roses/aurora.webp", type: "flower" },
    { label: "Bit More", src: "/img/roses/bit_more.webp", type: "flower" },
    { label: "Candy Cane", src: "/img/roses/candy_cane.webp", type: "flower" },
    { label: "Devotion", src: "/img/roses/devotion.webp", type: "flower" },
    { label: "Esperance", src: "/img/roses/esperance.webp", type: "flower" },
    { label: "Fascination", src: "/img/roses/fascination.webp", type: "flower" },
    { label: "Lady in Red", src: "/img/roses/lady_in_red.webp", type: "flower" },
    { label: "Marzipan", src: "/img/roses/marzipan.webp", type: "flower" },
    { label: "New Emotion", src: "/img/roses/new_emotion.webp", type: "flower" },
    { label: "Peach Rose Ali", src: "/img/roses/peach_rose_ali.webp", type: "flower" },
    { label: "Pink Expression", src: "/img/roses/pinkexpression_v2.webp", type: "flower" },
    { label: "Shocking Blue", src: "/img/roses/shoking_blue.webp", type: "flower" },
    { label: "Spectra", src: "/img/roses/spectra.webp", type: "flower" },
    { label: "Teddy's", src: "/img/roses/teddys.webp", type: "flower" },
    { label: "Vicky", src: "/img/roses/vicky.webp", type: "flower" },
  ],
  Sprayroses: [
    { label: "B.S. Leo", src: "/img/sprayroses/b.s._leo.webp", type: "sprayrose" },
    { label: "Be Amazing", src: "/img/sprayroses/be_amazing.webp", type: "sprayrose" },
    { label: "Bellalinda Cerise", src: "/img/sprayroses/bellalinda_cerise.webp", type: "sprayrose" },
    { label: "Bellalinda Monet", src: "/img/sprayroses/bellalinda_monet.webp", type: "sprayrose" },
    { label: "Bright Sensation", src: "/img/sprayroses/bright_sensation.webp", type: "sprayrose" },
    { label: "Elegant Rosever", src: "/img/sprayroses/elegant_rosever.webp", type: "sprayrose" },
    { label: "Fire Up", src: "/img/sprayroses/fireup.webp", type: "sprayrose" },
    { label: "Gemstar", src: "/img/sprayroses/gemstar.webp", type: "sprayrose" },
    { label: "Ilse", src: "/img/sprayroses/Ilse.webp", type: "sprayrose" },
    { label: "Royal Rosever", src: "/img/sprayroses/royal_rosever.webp", type: "sprayrose" },
    { label: "Sweet Dreams", src: "/img/sprayroses/sweet_dreams.webp", type: "sprayrose" },
  ],
  Gypsophilla: [
    { label: "Gypsophilla Weiss", src: "/img/gypsophilla.webp", type: "gypsophilla" },
    { label: "Gypsophilla Rosa", src: "/img/gypsophilla-rosa.webp", type: "gypsophilla" },
  ],
  "Sri Lanka": [
    { label: "Palmblatt", src: "/img/srilanka/palmblatt.webp", type: "srilanka" },
    { label: "Monstera", src: "/img/srilanka/monstera.webp", type: "srilanka" },
  ],
  "Flower Plugs": [
    { label: "Herzstecker", src: "/img/stecker/herzstecker.webp", type: "plug" },
    { label: "Happy Birthday", src: "/img/stecker/stecker-hb.webp", type: "plug" },
  ],
  Chrysanthemums: [
    { label: "Santini Green", src: "/img/chrysanthemen/santini-green.webp", type: "chrysanthemum" },
    { label: "Santini White", src: "/img/chrysanthemen/santini-white.webp", type: "chrysanthemum" },
  ],
  Filler: [
    { label: "Eucalyptus", src: "/img/filler/eucalyptus.webp", type: "filler" },
    { label: "Limonium", src: "/img/filler/limonium.webp", type: "filler" },
    { label: "Lillie", src: "/img/filler/lillie.webp", type: "filler" },
  ],
};

export default function SidebarLeft({
  setCanvasItems,
  setSleeveSrc, // NEU
}: {
  setCanvasItems: Function;
  setSleeveSrc: React.Dispatch<React.SetStateAction<string>>; // NEU
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const handleAddImage = (src: string, label: string, type: ItemType = "flower") => {
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
    <Accordion type="single" collapsible className="flex flex-col gap-2">
      {Object.entries(data).map(([category, items]) => {
        return (
          <AccordionItem
            value={category}
            key={category}
            className="rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] overflow-hidden bg-white"
          >
            <AccordionTrigger className="flex items-center justify-between w-full gap-2 py-2 text-lg text-left group">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {{
                    Sleeves: "📦",
                    Roses: "🌹",
                    Sprayroses: "💐",
                    Gypsophilla: "🌾",
                    "Sri Lanka": "🌿",
                    "Flower Plugs": "🔖",
                    Chrysanthemums: "🌼",
                    Filler: "🍃",
                  }[category] || "🪴"}
                </span>
                <span>{category}</span>
              </div>
              <span className="ml-auto transition-transform duration-300 group-data-[state=open]:rotate-180">⌄</span>
            </AccordionTrigger>
            <AccordionContent className="transition-all duration-300 ease-in-out">
              <div className="grid grid-cols-2 gap-3 mt-2">
                {items.map(({ label, src, type }) => (
                  <div
                    key={label}
                    onClick={() => handleAddImage(src, label, type)}
                    className="flex flex-col items-center w-full p-3 text-center transition-all duration-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:backdrop-blur-sm"
                  >
                    <img src={src} alt={label} className="object-contain w-16 h-16 mb-1" />
                    <span className="text-sm">{label.replace(/\.webp$/, "")}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
