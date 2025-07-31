import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";

// Component to display user's saved designs in a modal
export default function MyDesignsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  // State to hold the fetched designs
  const [designs, setDesigns] = useState<any[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

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

  return (
    // Modal backdrop covering entire screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal container with white background and scrollable content */}
      <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative">
        {/* Close button in top-right corner */}
        <button onClick={onClose} className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-red-500" aria-label="Schliessen">
          &times;
        </button>
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
                <img src={design.image_url} alt="Design Preview" className="object-cover w-full h-full mb-2 rounded" />
                {/* Title and creation date row */}
                <div className="flex items-center justify-between w-full mb-2">
                  <p className="text-lg font-semibold text-agrotropic-blue">{design.title || "Ohne Titel"}</p>
                  <p className="text-gray-600 text-md">{new Date(design.created_at).toLocaleDateString()}</p>
                </div>
                {/* Buttons row */}
                <div className="grid w-full grid-cols-1 gap-2 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                  <button onClick={() => window.open(design.image_url, "_blank")} className="w-full px-4 py-2 text-base font-medium text-white truncate rounded bg-agrotropic-blue hover:bg-agrotropic-blue/80 text-ellipsis whitespace-nowrap">
                    Bild herunterladen
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([design.materials_csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${design.title || "design"}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-2 text-base font-medium text-white truncate rounded bg-agrotropic-green hover:bg-green-900 text-ellipsis whitespace-nowrap"
                  >
                    Werkstoffe (CSV)
                  </button>
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
                    className="w-full px-4 py-2 text-base font-medium text-white truncate bg-red-500 rounded hover:bg-red-600 text-ellipsis whitespace-nowrap"
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
