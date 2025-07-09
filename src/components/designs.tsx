// filename: MyDesignsModal.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

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
        .select("id, image_url, prompt, created_at")
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
                {/* Design prompt text, truncated with tooltip */}
                <p className="w-full mb-1 text-lg truncate text-agrotropic-blue" title={design.prompt}>
                  {design.prompt}
                </p>
                {/* Download button to open image in a new tab */}
                <button
                  onClick={() => window.open(design.image_url, "_blank")}
                  className="px-4 py-2 text-lg text-white transition-colors duration-200 rounded bg-agrotropic-blue hover:text-bg-gray-800"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
