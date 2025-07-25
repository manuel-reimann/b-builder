import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

type ItemType = "flower" | "sprayrose" | "gypsophilla" | "srilanka" | "plug" | "chrysanthemum" | "filler" | "sleeve" | "background";
type DataItem = {
  label: string;
  src: string;
  type: ItemType;
  promptAddition?: string;
  stackable?: boolean;
};
type Data = Record<string, DataItem[]>;
const data: Data = {
  Backgrounds: [
    { label: "Christmas 1", src: "/img/bgs/christmas1.webp", type: "background", promptAddition: "Frame the bouquet with delicate frosty snowflakes for a winter feel.", stackable: false },
    { label: "Christmas 2", src: "/img/bgs/christmas2.webp", type: "background", stackable: false },
    { label: "Christmas 3", src: "/img/bgs/christmas3.webp", type: "background", stackable: false },
    { label: "Empty 1", src: "/img/bgs/empty1.webp", type: "background", stackable: false },
    { label: "Empty 2", src: "/img/bgs/empty2.webp", type: "background", stackable: false },
    { label: "Empty 3", src: "/img/bgs/empty3.webp", type: "background", stackable: false },
    { label: "Florist 1", src: "/img/bgs/florist1.webp", type: "background", promptAddition: "Add gentle pastel bokeh lighting behind the bouquet to create a dreamy ambiance.", stackable: false },
    { label: "Florist 2", src: "/img/bgs/florist2.webp", type: "background", stackable: false },
    { label: "Florist 3", src: "/img/bgs/florist3.webp", type: "background", stackable: false },
    { label: "Florist 4", src: "/img/bgs/florist4.webp", type: "background", stackable: false },
    { label: "Florist 5", src: "/img/bgs/florist5.webp", type: "background", stackable: false },
    { label: "Florist 6", src: "/img/bgs/florist6.webp", type: "background", stackable: false },
    { label: "Florist 7", src: "/img/bgs/florist7.webp", type: "background", stackable: false },
    { label: "Valentine 1", src: "/img/bgs/valentine1.webp", type: "background", promptAddition: "Enhance the background with soft pink heart petals on the valentine table", stackable: false },
    { label: "Valentine 2", src: "/img/bgs/valentine2.webp", type: "background", stackable: false },
    { label: "Valentine 3", src: "/img/bgs/valentine3.webp", type: "background", stackable: false },
  ],
  Sleeves: [
    { label: "Braun", src: "/img/sleeves/sleeve1_v2.webp", type: "sleeve", promptAddition: "Do not change the brown sleeve behind the flowers in shape or texture.", stackable: false },
    { label: "VM 961", src: "/img/sleeves/vm961_v2.webp", type: "sleeve", stackable: false },
    { label: "VM 968", src: "/img/sleeves/vm968_v2.webp", type: "sleeve", stackable: false },
    { label: "VM 1029", src: "/img/sleeves/vm1029_v2.webp", type: "sleeve", stackable: false },
    { label: "VM 1033", src: "/img/sleeves/vm1033_v2.webp", type: "sleeve", stackable: false },
  ],
  Roses: [
    { label: "Devotion", src: "/img/roses/devotion.webp", type: "flower" },
    { label: "Lady in Red", src: "/img/roses/lady_in_red.webp", type: "flower" },
    { label: "Bit More", src: "/img/roses/bit_more.webp", type: "flower" },
    { label: "Esperance", src: "/img/roses/esperance.webp", type: "flower" },
    { label: "Pink Expression", src: "/img/roses/pinkexpression_v2.webp", type: "flower" },
    { label: "Fascination", src: "/img/roses/fascination.webp", type: "flower" },
    { label: "New Emotion", src: "/img/roses/new_emotion.webp", type: "flower" },
    { label: "Peach Rose Ali", src: "/img/roses/peach_rose_ali.webp", type: "flower" },
    { label: "Vicky", src: "/img/roses/vicky.webp", type: "flower" },
    { label: "Marzipan", src: "/img/roses/marzipan.webp", type: "flower" },
    { label: "Spectra", src: "/img/roses/spectra.webp", type: "flower" },
    { label: "Aurora", src: "/img/roses/aurora.webp", type: "flower" },
    { label: "Teddy's", src: "/img/roses/teddys.webp", type: "flower" },
    { label: "Aly", src: "/img/roses/aly.webp", type: "flower" },
    { label: "Shocking Blue", src: "/img/roses/shoking_blue.webp", type: "flower" },
  ],
  Sprayroses: [
    { label: "Fire Up", src: "/img/sprayroses/fireup.webp", type: "sprayrose" },
    { label: "Gemstar", src: "/img/sprayroses/gemstar.webp", type: "sprayrose" },
    { label: "Bellalinda Cerise", src: "/img/sprayroses/bellalinda_cerise.webp", type: "sprayrose" },
    { label: "Bellalinda Monet", src: "/img/sprayroses/bellalinda_monet.webp", type: "sprayrose" },
    { label: "B.S. Leo", src: "/img/sprayroses/b.s._leo.webp", type: "sprayrose" },
    { label: "Royal Rosever", src: "/img/sprayroses/royal_rosever.webp", type: "sprayrose" },
    { label: "Bright Sensation", src: "/img/sprayroses/bright_sensation.webp", type: "sprayrose" },
    { label: "Elegant Rosever", src: "/img/sprayroses/elegant_rosever.webp", type: "sprayrose" },
    { label: "Ilse", src: "/img/sprayroses/Ilse.webp", type: "sprayrose" },
    { label: "Be Amazing", src: "/img/sprayroses/be_amazing.webp", type: "sprayrose" },
    { label: "Sweet Dreams", src: "/img/sprayroses/sweet_dreams.webp", type: "sprayrose" },
  ],
  Gypsophilla: [
    { label: "Gypsophilla Weiss", src: "/img/gyps/white.webp", type: "gypsophilla" },
    { label: "Gypsophilla Rosa", src: "/img/gyps/pink.webp", type: "gypsophilla" },
  ],
  "Sri Lanka": [
    { label: "Dracaena Sanderiana White", src: "/img/srilanka/dracaena_sanderiana_white.webp", type: "srilanka" },
    { label: "Dracaena surculosa Florida Beauty", src: "/img/srilanka/ds_florida_beauty.webp", type: "srilanka" },
    { label: "Chrysalidocarpus lutescens", src: "/img/srilanka/kentia.webp", type: "srilanka" },
    { label: "Polyscias scutellaria", src: "/img/srilanka/polyscias_scutellaria.webp", type: "srilanka" },
    { label: "Cordyline fruticosa Indian Summer", src: "/img/srilanka/cordyline_fruticosa_indian_summer.webp", type: "srilanka" },
    { label: "Cordyline fruticosa Red", src: "/img/srilanka/cordyline_fruticosa_red.webp", type: "srilanka" },
    { label: "Cordyline fruticosa Yellow Flash", src: "/img/srilanka/cordyline_fruticosa_yellow_flash.webp", type: "srilanka" },
    { label: "Cordyline Fruticosa", src: "/img/srilanka/cordyline_fruticosa.webp", type: "srilanka" },
    { label: "Cordyline Fruticosa Red Majesty", src: "/img/srilanka/cordyline_fruticosa_red_majesty.webp", type: "srilanka" },
  ],
  "Flower Plugs": [
    { label: "Herzstecker", src: "/img/flowerplugs/herz_glaenzend.webp", type: "plug" },
    { label: "Osterhase", src: "/img/flowerplugs/ostern.webp", type: "plug" },
    { label: "Silvester", src: "/img/flowerplugs/silvester.webp", type: "plug" },
    { label: "Silvester 2", src: "/img/flowerplugs/silvester2.webp", type: "plug" },
  ],
  Chrysanthemums: [
    { label: "Chrysanthemums White", src: "/img/chrysanthemums/chrysanthemums_white.webp", type: "chrysanthemum" },
    { label: "Chrysanthemums Purple", src: "/img/chrysanthemums/chrysanthemums_purple.webp", type: "chrysanthemum" },
  ],
  Filler: [
    { label: "Hypericum", src: "/img/filler/hypericum.webp", type: "filler" },
    { label: "Eucalyptus", src: "/img/filler/eucalyptus.webp", type: "filler", promptAddition: "You may adjust the angle of the Eucalyptus for enhanced realism.", stackable: true },
    { label: "Delphinium", src: "/img/filler/delphinium.webp", type: "filler", promptAddition: "You may adjust the size of the Delphinium for a better overall look", stackable: true },
    { label: "Lillie", src: "/img/filler/lillie.webp", type: "filler" },
    { label: "Veronica", src: "/img/filler/veronica.webp", type: "filler" },
  ],
};

// Named asset lists for prompt-building in Canvas
export const backgroundAssets: DataItem[] = data.Backgrounds;

export const sleeveAssets: DataItem[] = data.Sleeves;

// Combined list of all assets for hydrating and prompt additions
export const allAssets: DataItem[] = Object.values(data).flat();

const DESIGN_CATEGORIES = ["Backgrounds", "Sleeves"];

export default function SidebarLeft({
  setCanvasItems,
  setSleeveSrc,
  setBackgroundSrc,
  canvasContainerRef,
}: {
  setCanvasItems: Function;
  setSleeveSrc: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundSrc: React.Dispatch<React.SetStateAction<string | null>>;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  showOnly?: string[];
}) {
  const handleAddImage = (src: string, label: string, type: ItemType = "flower", promptAddition?: string, stackable: boolean = true) => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      // Dynamically set maxHeight depending on type to ensure sleeves appear larger
      const maxHeight = type === "sleeve" ? 280 : 150;
      // Calculate scale so that image fits within maxHeight constraint
      const scale = Math.min(1, maxHeight / img.height);
      // Apply random offset so new items don’t stack at same position
      const randomOffset = () => Math.floor(Math.random() * 300) - 150;

      const newItem = {
        id: uuidv4(),
        src,
        label,
        x: 400 + randomOffset(),
        y: 300 + randomOffset(),
        rotation: 0,
        scale,
        maxWidth: maxHeight,
        maxHeight,
        type,
        promptAddition,
        stackable,
      };

      // If a sleeve is selected, update sleeve background and existing canvas sleeve element
      if (type === "sleeve") {
        // change sleeve background
        setSleeveSrc(src);

        // simultaneously update existing sleeve item in canvas
        setCanvasItems((prev: any[]) =>
          prev.map((item) =>
            item.type === "sleeve"
              ? { ...item, src, label } // src & label replace
              : item
          )
        );
      }
      // If a background is selected, update CSS background image dynamically
      else if (type === "background") {
        setBackgroundSrc(src);
        if (canvasContainerRef.current) {
          canvasContainerRef.current.style.setProperty("background-image", `url(${src})`);
        }
        return;
      }
      // For all other items, add them as new draggable canvas elements
      else {
        setCanvasItems((prev: any[]) => [...prev, newItem]);
      }
    };
  };

  function renderAccordionItem(category: string, items: DataItem[], handleAddImage: (src: string, label: string, type: ItemType, promptAddition?: string, stackable?: boolean) => void) {
    return (
      <AccordionItem value={category} key={category} className="rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] overflow-hidden bg-white">
        <AccordionTrigger className="flex items-center justify-between w-full gap-2 py-2 text-lg text-left group">
          <div className="flex items-center gap-2">
            <span className="text-base">
              {{
                Backgrounds: "🖼️",
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
            {items.map(({ label, src, type, promptAddition, stackable }) => (
              <div
                key={label}
                onClick={() => handleAddImage(src, label, type, promptAddition, stackable ?? true)}
                draggable={type !== "background" && type !== "sleeve"}
                onDragStart={(e) => {
                  if (type === "background" || type === "sleeve") return;

                  e.dataTransfer.setData("application/json", JSON.stringify({ src, label, type }));

                  const img = new Image();
                  img.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
                  img.style.position = "absolute";
                  img.style.top = "-1000px";
                  document.body.appendChild(img);
                  setTimeout(() => {
                    document.body.removeChild(img);
                  }, 0);
                }}
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
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Set the mood</h2>
      <Accordion type="single" collapsible className="flex flex-col gap-2 mb-6">
        {Object.entries(data)
          .filter(([category]) => DESIGN_CATEGORIES.includes(category))
          .map(([category, items]) => renderAccordionItem(category, items, handleAddImage))}
      </Accordion>

      <h2 className="mb-2 text-xl font-semibold">Assets</h2>
      <Accordion type="single" collapsible className="flex flex-col gap-2">
        {Object.entries(data)
          .filter(([category]) => !DESIGN_CATEGORIES.includes(category))
          .map(([category, items]) => renderAccordionItem(category, items, handleAddImage))}
      </Accordion>
    </>
  );
}
