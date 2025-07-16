// filename: MyDesignsModal.tsx
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
      const { data, error } = await supabase
        .from("user_designs")
        .select("id, title, image_url, created_at, materials_csv")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

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
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-red-500"
          aria-label="Schliessen"
        >
          &times;
        </button>
        {/* Modal title */}
        <h2 className="mb-4 text-2xl font-semibold">My Designs</h2>

        {/* Conditional rendering based on loading state and design availability */}
        {loading ? (
          // Show loading text while fetching data
          <p>Loading...</p>
        ) : designs.length === 0 ? (
          // Show message if no designs are available
          <p className="text-gray-500">Noch keine Designs vorhanden.</p>
        ) : (
          // Grid layout for displaying design cards
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => (
              <div key={design.id} className="flex flex-col items-center p-4 border rounded shadow">
                {/* Preview image of the design */}
                <img src={design.image_url} alt="Design Preview" className="object-cover w-full h-48 mb-2 rounded" />
                {/* Design title */}
                <p className="w-full mb-1 text-lg font-semibold text-agrotropic-blue">{design.title || "Ohne Titel"}</p>
                {/* Creation date */}
                <p className="mb-2 text-sm text-gray-500">{new Date(design.created_at).toLocaleString()}</p>
                {/* Download image */}
                <button
                  onClick={() => window.open(design.image_url, "_blank")}
                  className="px-4 py-1 mb-1 text-sm text-white rounded bg-agrotropic-blue hover:bg-agrotropic-blue/80"
                >
                  Bild herunterladen
                </button>
                {/* Download CSV */}
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
                  className="px-4 py-1 mb-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Werkstoffe (CSV)
                </button>
                {/* Placeholder: Delete design */}
                <button
                  onClick={async () => {
                    const confirmDelete = window.confirm("Möchtest du dieses Design wirklich löschen?");
                    if (!confirmDelete) return;
                    const { error } = await supabase
                      .from("user_designs")
                      .delete()
                      .eq("id", design.id)
                      .eq("user_id", userId);
                    if (error) {
                      console.error("Fehler beim Löschen des Designs:", error);
                      alert("Fehler beim Löschen.");
                    } else {
                      setDesigns((prev) => prev.filter((d) => d.id !== design.id));
                    }
                  }}
                  className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Löschen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
