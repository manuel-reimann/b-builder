import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";

// Component to display user's saved designs in a modal
export default function MyDesignsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  // State to hold the fetched designs
  const [designs, setDesigns] = useState<any[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});

  // Fetch designs from Supabase when component mounts
  useEffect(() => {
    const fetchDesigns = async () => {
      // Query user_designs table for designs, ordered by creation date descending
      const { data, error } = await supabase.from("user_designs").select("id, title, image_url, created_at, materials_csv").eq("user_id", userId).order("created_at", { ascending: false });

      if (error) {
        // Log any errors encountered during fetch
        console.error("Fehler beim Laden der Designs:", error);
      } else {
        // Update state with fetched designs or empty array if none
        setDesigns(data || []);
      }
      // Set loading to false after fetch completes
      setLoading(false);
    };

    fetchDesigns();
  }, []);

  useEffect(() => {
    designs.forEach((design) => {
      if (!blobUrls[design.id]) {
        fetch(design.image_url)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setBlobUrls((prev) => ({ ...prev, [design.id]: url }));
          })
          .catch((error) => console.error("Fehler beim Vorladen des Bild-Blobs:", error));
      }
    });
  }, [designs]);

  return (
    // Modal backdrop covering entire screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      {/* Modal container with white background and scrollable content */}
      <div className="bg-white w-3/4 max-h-[80vh] min-h-[60vh] overflow-y-auto p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button in top-right corner */}
        <span onClick={onClose} className="absolute p-1 text-3xl leading-none transition-colors rounded-full cursor-pointer top-2 right-4 hover:text-red-600" aria-label="Schliessen">
          x
        </span>
        {/* Modal title */}
        <h2 className="mb-4 text-2xl font-semibold">Meine Designs</h2>

        {/* Conditional rendering based on loading state and design availability */}
        {loading ? (
          // Show loading text while fetching data
          <p>Laden...</p>
        ) : designs.length === 0 ? (
          // Show message if no designs are available
          <p className="text-gray-500">Noch keine Designs vorhanden.</p>
        ) : (
          // Grid layout for displaying design cards
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => (
              <div key={design.id} className="flex flex-col items-center p-4 border rounded shadow">
                {/* Preview image of the design */}
                <img src={design.image_url} alt="Design Preview" loading="lazy" className="object-cover w-full aspect-[3/2] mb-2 rounded" />
                {/* Title and creation date row */}
                <div className="flex items-center justify-between w-full mb-2">
                  <p className="text-lg font-semibold text-agrotropic-blue">{design.title || "Ohne Titel"}</p>
                  <p className="text-gray-600 text-md">{new Date(design.created_at).toLocaleDateString()}</p>
                </div>
                {/* Buttons row */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="relative inline-flex">
                    <button
                      onClick={() => {
                        const url = blobUrls[design.id];
                        if (!url) return;
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = design.title || "design";
                        a.click();
                      }}
                      className="px-4 py-2 text-base font-medium text-white !rounded-r-none bg-agrotropic-blue hover:bg-agrotropic-blue/80"
                    >
                      Download Bild
                    </button>
                    <button onClick={() => setDropdownOpen(dropdownOpen === design.id ? null : design.id)} className="px-4 py-2 text-white text-sm !rounded-l-none bg-agrotropic-blue hover:bg-agrotropic-blue/80" aria-label="Mehr Optionen">
                      ▼
                    </button>
                    {dropdownOpen === design.id && (
                      <div className="absolute left-0 z-10 w-full mt-1 transition duration-150 ease-out bg-white border border-gray-200 rounded-md shadow-lg top-full">
                        <button
                          onClick={() => {
                            const blob = new Blob([design.materials_csv], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${design.title || "design"}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                            setDropdownOpen(null);
                          }}
                          className="block w-full px-2 py-2 text-base font-medium text-white truncate transition bg-agrotropic-blue hover:bg-agrotropic-blue/80"
                        >
                          Werkstücke (.csv)
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm("Möchtest du dieses Design wirklich löschen?");
                      if (!confirmDelete) return;
                      const { error } = await supabase.from("user_designs").delete().eq("id", design.id).eq("user_id", userId);
                      if (error) {
                        console.error("Fehler beim Löschen des Designs:", error);
                        alert("Fehler beim Löschen.");
                      } else {
                        setDesigns((prev) => prev.filter((d) => d.id !== design.id));
                      }
                    }}
                    className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
