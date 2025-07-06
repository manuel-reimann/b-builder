// filename: MyDesignsModal.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function MyDesignsModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      const { data, error } = await supabase
        .from("user_designs")
        .select("id, image_url, prompt, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fehler beim Laden der Designs:", error);
      } else {
        setDesigns(data || []);
      }
      setLoading(false);
    };

    fetchDesigns();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
          aria-label="Schliessen"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">My Designs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : designs.length === 0 ? (
          <p className="text-gray-500">Noch keine Designs vorhanden.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="border rounded shadow p-4 flex flex-col items-center"
              >
                <img
                  src={design.image_url}
                  alt="Design Preview"
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p
                  className="text-sm text-gray-700 mb-1 truncate w-full"
                  title={design.prompt}
                >
                  {design.prompt}
                </p>
                <a
                  href={design.image_url}
                  download
                  className="text-blue-600 hover:underline text-sm"
                >
                  Herunterladen
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
