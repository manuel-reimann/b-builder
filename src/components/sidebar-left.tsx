import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { v4 as uuidv4 } from "uuid";

type ItemType = "flower" | "sprayrose" | "gypsophilla" | "srilanka" | "plug" | "chrysanthemum" | "lilien" | "filler" | "sleeve" | "background";
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
    {
      label: "Marmortisch",
      src: "/img/bgs/marmor.webp",
      type: "background",
      promptAddition: "Create a white marble stone tabletop beneath the bouquet, top-down, with subtle veining and a soft contact shadow; keep the bouquet and paper wrap unchanged.",
      stackable: false,
    },
    {
      label: "Weiss",
      src: "/img/bgs/white.webp",
      type: "background",
      promptAddition: "Use a clean, matte white tabletop beneath the bouquet, viewed from above. Keep it uniform and low-contrast with a soft contact shadow; no room geometry, no props.",
      stackable: false,
    },
    {
      label: "Holztisch",
      src: "/img/bgs/empty1.webp",
      type: "background",
      promptAddition: "Use a pale wooden tabletop beneath the bouquet, seen from directly above, with fine grain and low contrast. Add a soft contact shadow; no room elements or strong perspective cues.",
      stackable: false,
    },
    {
      label: "Weiss lackierter Holztisch",
      src: "/img/bgs/empty2.webp",
      type: "background",
      promptAddition: "Place the bouquet on a white-painted wooden tabletop from an overhead view, with faint plank lines and very low texture. Include a soft contact shadow; no furniture, no angled room geometry.",
      stackable: false,
    },
    {
      label: "Floristentisch",
      src: "/img/bgs/florist3.webp",
      type: "background",
      promptAddition: "Show a florist’s workbench from directly above: a neutral benchtop with a few small tools at the far edges only, partially cropped and softly defocused. Do not let tools overlap the bouquet; add a soft contact shadow and avoid room perspective.",
      stackable: false,
    },
    {
      label: "Floristentisch 2",
      src: "/img/bgs/florist7.webp",
      type: "background",
      promptAddition: "Show a florist’s workbench from directly above: a neutral benchtop with a few small tools at the far edges only, partially cropped and softly defocused. Do not let tools overlap the bouquet; add a soft contact shadow and avoid room perspective.",
      stackable: false,
    },
    {
      label: "Weihnachtstisch",
      src: "/img/bgs/christmas2.webp",
      type: "background",
      promptAddition: "Use a subtle Christmas-themed tabletop seen from above: muted, low-contrast decor near the edges only (e.g., tiny gold speckles or soft bokeh), staying secondary to the bouquet. Add a gentle contact shadow; no walls, furniture or strong perspective.",
      stackable: false,
    },
    {
      label: "Weihnachtstisch 2",
      src: "/img/bgs/christmas3.webp",
      type: "background",
      promptAddition: "Create a festive tabletop from a top-down view with lightly scattered holiday elements at the far edges (e.g., a hint of ribbon or miniature ornaments), softly defocused and low-contrast. Keep the bouquet clear; add a soft contact shadow and avoid any overlapping props.",
      stackable: false,
    },
    {
      label: "Valentinstisch",
      src: "/img/bgs/valentine1.webp",
      type: "background",
      promptAddition: "Use a Valentine-inspired tabletop from a top-down view with tiny, low-contrast heart details near the edges only. Keep all decor subtle and secondary; add a soft contact shadow and avoid any room elements.",
      stackable: false,
    },
    {
      label: "Valentinstisch 2",
      src: "/img/bgs/valentine2.webp",
      type: "background",
      promptAddition: "From a top-down view, use a romantic tabletop with a gentle red/pink accent field and tiny heart motifs confined to the margins, softly defocused and low-contrast; add a soft contact shadow and avoid any room elements.",
      stackable: false,
    },
  ],
  Sleeves: [
    { label: "VM 961", src: "/img/sleeves/vm961_v2.webp", type: "sleeve", promptAddition: "Do not modify the brown-white paper wrap — keep its shape, color, material, folds and seams exactly as in the image.", stackable: false },
    { label: "VM 964", src: "/img/sleeves/sleeve1_v2.webp", type: "sleeve", promptAddition: "Do not modify the brown paper wrap — keep its shape, color, material, folds and seams exactly as in the image.", stackable: false },
    { label: "VM 968", src: "/img/sleeves/vm968_v2.webp", type: "sleeve", promptAddition: "Do not modify the light-brown paper wrap — keep its shape, color, material, folds and seams exactly as in the image.", stackable: false },
    { label: "VM 1029", src: "/img/sleeves/vm1029_v2.webp", type: "sleeve", promptAddition: "Do not modify the green paper wrap — keep its shape, color, material, folds and seams exactly as in the image.", stackable: false },
    { label: "VM 1033", src: "/img/sleeves/vm1033_v2.webp", type: "sleeve", promptAddition: "Do not modify the pink paper wrap — keep its shape, color, material, folds and seams exactly as in the image.", stackable: false },
  ],
  Roses: [
    {
      label: "Devotion",
      src: "/img/roses/devotion.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Lady in Red",
      src: "/img/roses/lady_in_red.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Bit More",
      src: "/img/roses/bit_more.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Esperance",
      src: "/img/roses/esperance.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Pink Expression",
      src: "/img/roses/pinkexpression_v2.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Pink Avalanche",
      src: "/img/roses/pink-avalanche.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Fascination",
      src: "/img/roses/fascination.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "New Emotion",
      src: "/img/roses/new_emotion.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },

    {
      label: "Peach Rose Ali",
      src: "/img/roses/peach_rose_ali.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "King's Cross",
      src: "/img/roses/kings-cross.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Wild Crown",
      src: "/img/roses/wild-crown.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Vicky",
      src: "/img/roses/vicky.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Marzipan",
      src: "/img/roses/marzipan.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Spectra",
      src: "/img/roses/spectra.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Aurora",
      src: "/img/roses/aurora.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Teddy's",
      src: "/img/roses/teddys.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Aly",
      src: "/img/roses/aly.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Westminster Abbey",
      src: "/img/roses/westminster-abbey.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
    {
      label: "Shocking Blue",
      src: "/img/roses/shoking_blue.webp",
      type: "flower",
      promptAddition: "Add a small amount of rose foliage confined to the interior of the bouquet: short stem segments and small serrated rose leaflets partially occluded by petals in the gaps between adjacent rose-heads. Use only rose leaves; do not add any background greenery or scenery, and do not place any leaves outside or behind the paper wrap.",
      stackable: false,
    },
  ],
  Sprayroses: [
    { label: "Fire Up", src: "/img/sprayroses/fireup.webp", type: "sprayrose" },
    { label: "Bellinda Brick", src: "/img/sprayroses/bellinda-brick.webp", type: "sprayrose" },
    { label: "Bellalinda Monet", src: "/img/sprayroses/bellalinda_monet.webp", type: "sprayrose" },
    { label: "La Manderina", src: "/img/sprayroses/la-mandarina.webp", type: "sprayrose" },
    { label: "Bright Sensation", src: "/img/sprayroses/bright_sensation.webp", type: "sprayrose" },
    { label: "Julieta", src: "/img/sprayroses/julieta.webp", type: "sprayrose" },
    { label: "B.S. Leo", src: "/img/sprayroses/b.s._leo.webp", type: "sprayrose" },
    { label: "Royal Rosever", src: "/img/sprayroses/royal_rosever.webp", type: "sprayrose" },
    { label: "Happy Birthday", src: "/img/sprayroses/happy-birthday.webp", type: "sprayrose" },
    { label: "Ritual", src: "/img/sprayroses/ritual.webp", type: "sprayrose" },
    { label: "Elegant Rosever", src: "/img/sprayroses/elegant_rosever.webp", type: "sprayrose" },
    { label: "Ilse", src: "/img/sprayroses/Ilse.webp", type: "sprayrose" },
    { label: "Be Amazing", src: "/img/sprayroses/be_amazing.webp", type: "sprayrose" },
    { label: "Sweet Dreams", src: "/img/sprayroses/sweet_dreams.webp", type: "sprayrose" },
  ],
  Gypsophilla: [
    { label: "Gypsophilla Weiss", src: "/img/gyps/white.webp", type: "gypsophilla" },
    { label: "Gypsophilla Rosa", src: "/img/gyps/pink.webp", type: "gypsophilla" },
    { label: "Gypsophilla Weiss-Gelb", src: "/img/gyps/yellow-white.webp", type: "gypsophilla" },
  ],
  "Sri Lanka": [
    {
      label: "Monstera Epipremnum",
      src: "/img/srilanka/monstera_ epipremnum.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Dracaena Sanderiana White",
      src: "/img/srilanka/dracaena_sanderiana_white.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Dracaena surculosa Florida Beauty",
      src: "/img/srilanka/ds_florida_beauty.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Chrysalidocarpus lutescens",
      src: "/img/srilanka/kentia.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Polyscias scutellaria",
      src: "/img/srilanka/polyscias_scutellaria.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Cordyline fruticosa Indian Summer",
      src: "/img/srilanka/cordyline_fruticosa_indian_summer.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Cordyline fruticosa Red",
      src: "/img/srilanka/cordyline_fruticosa_red.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Cordyline fruticosa Yellow Flash",
      src: "/img/srilanka/cordyline_fruticosa_yellow_flash.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Cordyline Fruticosa",
      src: "/img/srilanka/cordyline_fruticosa.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
    {
      label: "Cordyline Fruticosa Red Majesty",
      src: "/img/srilanka/cordyline_fruticosa_red_majesty.webp",
      type: "srilanka",
      promptAddition: "Preserve the natural texture and surface characteristics of the foliage exactly; do not recolor, replace, or simplify any leaf surfaces.",
      stackable: false,
    },
  ],
  "Flower Plugs": [
    { label: "Herzstecker", src: "/img/flowerplugs/herz_glaenzend.webp", type: "plug" },
    { label: "Love", src: "/img/flowerplugs/love.webp", type: "plug" },
    { label: "Osterhase", src: "/img/flowerplugs/ostern.webp", type: "plug" },
    { label: "Silvester", src: "/img/flowerplugs/silvester.webp", type: "plug" },
    { label: "Silvester 2", src: "/img/flowerplugs/silvester2.webp", type: "plug" },
  ],
  Chrysanthemums: [
    { label: "Weisse Chrysantheme", src: "/img/chrysanthemums/chrysanthemums_white.webp", type: "chrysanthemum" },
    { label: "Lila Chrysantheme", src: "/img/chrysanthemums/chrysanthemums_purple.webp", type: "chrysanthemum" },
  ],
  Lilien: [
    { label: "Weisse Chrysantheme", src: "/img/chrysanthemums/dunkelviolett.webp", type: "lilien" },
    { label: "Lila Chrysantheme", src: "/img/chrysanthemums/dunkelviolett.webp", type: "lilien" },
  ],
  Filler: [
    { label: "Johanniskraut", src: "/img/filler/hypericum.webp", type: "filler", promptAddition: "Preserve the natural clusters of Hypericum berries; do not alter their color or size.", stackable: true },
    { label: "Eukalyptus", src: "/img/filler/eucalyptus.webp", type: "filler", promptAddition: "You may adjust the angle of the Eucalyptus for enhanced realism.", stackable: true },
    { label: "Rittersporn", src: "/img/filler/delphinium.webp", type: "filler", promptAddition: "You may adjust the size of the Delphinium for a better overall look", stackable: true },
    { label: "Lillie", src: "/img/filler/lillie.webp", type: "filler", promptAddition: "Keep the lilies’ petals and stamens intact; adjust only minor petal positioning for realism.", stackable: true },
    { label: "Veronica", src: "/img/filler/veronica.webp", type: "filler", promptAddition: "Preserve the slender Veronica spikes and delicate blooms; do not recolor or reshape their form.", stackable: true },
  ],
};

// Named asset lists for prompt-building in Canvas
export const backgroundAssets: DataItem[] = data.Backgrounds;

export const sleeveAssets: DataItem[] = data.Sleeves;

// Combined list of all assets for hydrating and prompt additions
export const allAssets: DataItem[] = Object.values(data).flat();

const DESIGN_CATEGORIES = ["Backgrounds", "Sleeves"];

const CATEGORY_LABELS: Record<string, string> = {
  Backgrounds: "Hintergründe",
  Sleeves: "Sleeves",
  Roses: "Rosen",
  Sprayroses: "Sprayrosen",
  Gypsophilla: "Schleierkraut",
  "Sri Lanka": "Sri Lanka Grün",
  "Flower Plugs": "Stecker",
  Chrysanthemums: "Chrysanthemen",
  Lilien: "Lilien",
  Filler: "Füllmaterial",
};

export default function SidebarLeft({ setCanvasItems, setSleeveSrc, setBackgroundSrc, canvasContainerRef }: { setCanvasItems: Function; setSleeveSrc: React.Dispatch<React.SetStateAction<string>>; setBackgroundSrc: React.Dispatch<React.SetStateAction<string | null>>; canvasContainerRef: React.RefObject<HTMLDivElement | null>; showOnly?: string[] }) {
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
            <img src={data[category][0].src} alt={`${category} icon`} className="object-contain w-5 h-5" />
            <span>{CATEGORY_LABELS[category] || category}</span>
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
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Setze die Stimmung</h2>
      <Accordion type="single" collapsible className="flex flex-col gap-2 mb-6">
        {Object.entries(data)
          .filter(([category]) => DESIGN_CATEGORIES.includes(category))
          .map(([category, items]) => renderAccordionItem(category, items, handleAddImage))}
      </Accordion>

      <h2 className="mb-2 text-xl font-semibold">Werkstoffe</h2>
      <Accordion type="single" collapsible className="flex flex-col gap-2">
        {Object.entries(data)
          .filter(([category]) => !DESIGN_CATEGORIES.includes(category))
          .map(([category, items]) => renderAccordionItem(category, items, handleAddImage))}
      </Accordion>
    </>
  );
}
