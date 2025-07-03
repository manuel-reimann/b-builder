import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

type ItemType = "element" | "sleeve";
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
  Rosen: [
    { label: "Aly", src: "/img/roses/aly.webp", type: "element" },
    { label: "Aurora", src: "/img/roses/aurora.webp", type: "element" },
    { label: "Bit More", src: "/img/roses/bit_more.webp", type: "element" },
    { label: "Candy Cane", src: "/img/roses/candy_cane.webp", type: "element" },
    { label: "Devotion", src: "/img/roses/devotion.webp", type: "element" },
    { label: "Esperance", src: "/img/roses/esperance.webp", type: "element" },
    { label: "Fascination", src: "/img/roses/fascination.webp", type: "element" },
    { label: "Lady in Red", src: "/img/roses/lady_in_red.webp", type: "element" },
    { label: "Marzipan", src: "/img/roses/marzipan.webp", type: "element" },
    { label: "New Emotion", src: "/img/roses/new_emotion.webp", type: "element" },
    { label: "Peach Rose Ali", src: "/img/roses/peach_rose_ali.webp", type: "element" },
    { label: "Pink Expression", src: "/img/roses/pinkexpression_v2.webp", type: "element" },
    { label: "Shocking Blue", src: "/img/roses/shoking_blue.webp", type: "element" },
    { label: "Spectra", src: "/img/roses/spectra.webp", type: "element" },
    { label: "Teddy's", src: "/img/roses/teddys.webp", type: "element" },
    { label: "Vicky", src: "/img/roses/vicky.webp", type: "element" },
  ],
  Sprayrosen: [
    { label: "B.S. Leo", src: "/img/sprayroses/b.s._leo.webp", type: "element" },
    { label: "Be Amazing", src: "/img/sprayroses/be_amazing.webp", type: "element" },
    { label: "Bellalinda Cerise", src: "/img/sprayroses/bellalinda_cerise.webp", type: "element" },
    { label: "Bellalinda Monet", src: "/img/sprayroses/bellalinda_monet.webp", type: "element" },
    { label: "Bright Sensation", src: "/img/sprayroses/bright_sensation.webp", type: "element" },
    { label: "Elegant Rosever", src: "/img/sprayroses/elegant_rosever.webp", type: "element" },
    { label: "Fire Up", src: "/img/sprayroses/fireup.webp", type: "element" },
    { label: "Gemstar", src: "/img/sprayroses/gemstar.webp", type: "element" },
    { label: "Ilse", src: "/img/sprayroses/Ilse.webp", type: "element" },
    { label: "Royal Rosever", src: "/img/sprayroses/royal_rosever.webp", type: "element" },
    { label: "Sweet Dreams", src: "/img/sprayroses/sweet_dreams.webp", type: "element" },
  ],
  Gypsophilla: [
    { label: "Gypsophilla Weiss", src: "/img/gypsophilla.webp", type: "element" },
    { label: "Gypsophilla Rosa", src: "/img/gypsophilla-rosa.webp", type: "element" },
  ],
  "Sri Lanka": [
    { label: "Palmblatt", src: "/img/palmblatt.webp", type: "element" },
    { label: "Monstera", src: "/img/monstera.webp", type: "element" },
  ],
  Stecker: [
    { label: "Herzstecker", src: "/img/herzstecker.webp", type: "element" },
    { label: "Happy Birthday", src: "/img/stecker-hb.webp", type: "element" },
  ],
  Chrysanthemen: [
    { label: "Santini Green", src: "/img/santini-green.webp", type: "element" },
    { label: "Santini White", src: "/img/santini-white.webp", type: "element" },
  ],
  Filler: [
    { label: "Eucalyptus", src: "/img/eukalyptus.webp", type: "element" },
    { label: "Limonium", src: "/img/limonium.webp", type: "element" },
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
  const handleAddImage = (src: string, label: string, type: "element" | "sleeve" = "element") => {
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
        <AccordionItem value={category} key={category} className="pb-2 border-b">
          <AccordionTrigger className="w-full py-2 text-lg font-semibold text-left">{category}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {items.map(({ label, src, type }) => (
                <div
                  key={label}
                  onClick={() => handleAddImage(src, label, type)}
                  className="flex flex-col items-center p-2 text-center bg-white border rounded cursor-pointer hover:shadow-md hover:bg-green-50"
                >
                  <img src={src} alt={label} className="object-contain w-16 h-16 mb-1" />
                  <span className="text-sm">{label.replace(/\.webp$/, "")}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
