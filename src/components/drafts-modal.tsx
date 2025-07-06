// filename: DraftsModal.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";
import { CanvasItem } from "./canvas";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function DraftsModal({
  userId,
  onClose,
  onLoadDraft,
  setSleeveSrc,
  onSelectDraftId,
}: {
  userId: string;
  onClose: () => void;
  onLoadDraft: (items: CanvasItem[], sleeveSrc?: string, draftId?: string, draftTitle?: string) => void;
  setSleeveSrc: (src: string) => void;
  onSelectDraftId: (id?: string | null) => void;
}) {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      const { data, error } = await supabase
        .from("user_drafts")
        .select("id, title, elements, sleeve, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fehler beim Laden der Drafts:", error);
      } else {
        setDrafts(data || []);
      }
      setLoading(false);
    };

    fetchDrafts();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-red-500"
          aria-label="Schliessen"
        >
          &times;
        </button>
        <h2 className="mb-4 text-2xl font-semibold">My Drafts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-500">Noch keine Entwürfe gespeichert.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex flex-col items-center p-4 border rounded shadow">
                <p className="mb-1 text-sm font-medium text-center">{draft.title || "(Ohne Titel)"}</p>
                <p className="mb-2 text-xs text-gray-500">{new Date(draft.created_at).toLocaleString()}</p>
                <button
                  onClick={() => {
                    // Hinweis: Ein Canvas-Screenshot pro Draft wäre visuell nützlich, erfordert aber separate Speicherung als Bild in Supabase.
                    // Neue Struktur: draft.elements enthält das Array, draft.sleeve ist der String
                    try {
                      onSelectDraftId("");

                      if (!draft.elements || !Array.isArray(draft.elements)) {
                        throw new Error("Draft data is empty or not an array");
                      }

                      const itemsArray: CanvasItem[] = draft.elements;
                      const sleeveSrc: string = draft.sleeve || "";

                      setSleeveSrc(sleeveSrc);
                      onLoadDraft(itemsArray, sleeveSrc, draft.id, draft.title);
                      toast.success("Entwurf geladen");
                      onSelectDraftId(draft.id);
                      onClose();
                    } catch (err) {
                      console.error("Error at parsing of the draft:", err);
                    }
                  }}
                  className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Laden
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase.from("user_drafts").delete().eq("id", draft.id);

                      if (error) {
                        throw error;
                      }

                      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                      toast.success("Entwurf gelöscht");
                    } catch (err) {
                      console.error("Fehler beim Löschen des Entwurfs:", err);
                      toast.error("Fehler beim Löschen");
                    }
                  }}
                  className="px-4 py-2 mt-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
