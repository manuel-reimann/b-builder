// filename: DraftsModal.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";
import { CanvasItem } from "./canvas";

// Initialize Supabase client using environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

// DraftsModal component props definition and component itself
export default function DraftsModal({
  userId,
  onClose,
  onLoadDraft,
  setSleeveSrc,
  onSelectDraftId,
  currentDraftId,
}: {
  userId: string;
  onClose: () => void;
  onLoadDraft: (items: CanvasItem[], sleeveSrc?: string, draftId?: string, draftTitle?: string) => void;
  setSleeveSrc: (src: string) => void;
  onSelectDraftId: (id?: string | null) => void;
  currentDraftId: string | null;
}) {
  // State to hold the list of drafts fetched from the database
  const [drafts, setDrafts] = useState<any[]>([]);
  // Loading state to indicate whether drafts are being fetched
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch drafts when the component mounts or when userId changes
  useEffect(() => {
    const fetchDrafts = async () => {
      // Query Supabase to get drafts for the current user, ordered by creation date descending
      const { data, error } = await supabase
        .from("user_drafts")
        .select("id, title, elements, sleeve, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        // Log any errors during fetching
        console.error("Fehler beim Laden der Drafts:", error);
      } else {
        // Update drafts state with fetched data or empty array
        setDrafts(data || []);
      }
      // Set loading to false after fetching completes
      setLoading(false);
    };

    fetchDrafts();
  }, [userId]);

  // Render the modal UI
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative">
        {/* Close button for the modal */}
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-red-500"
          aria-label="Schliessen"
        >
          &times;
        </button>
        {/* Modal title */}
        <h2 className="mb-4 text-2xl font-semibold">My Drafts</h2>
        {/* Conditional rendering based on loading state and drafts availability */}
        {loading ? (
          <p>Loading...</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-500">Noch keine Entwürfe gespeichert.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Map over drafts to display each draft */}
            {drafts.map((draft) => (
              <div key={draft.id} className="flex flex-col items-center p-4 border rounded shadow">
                {/* Draft title or placeholder if no title */}
                <p className="mb-1 text-lg font-semibold text-center">{draft.title || "(Ohne Titel)"}</p>
                {/* Draft creation date formatted */}
                <p className="mb-4 text-sm text-gray-600">{new Date(draft.created_at).toLocaleString()}</p>
                <div className="flex flex-row gap-2 mt-2">
                  {/* Load draft button */}
                  <button
                    onClick={() => {
                      // Load the selected draft into the canvas
                      try {
                        // Clear any previously selected draft ID
                        onSelectDraftId("");

                        // Validate draft elements exist and are an array
                        if (!draft.elements || !Array.isArray(draft.elements)) {
                          throw new Error("Draft data is empty or not an array");
                        }

                        // Cast draft elements to CanvasItem array and get sleeve source string
                        const itemsArray: CanvasItem[] = draft.elements;
                        const sleeveSrc: string = draft.sleeve || "";

                        // Set sleeve image source and load draft items into canvas
                        setSleeveSrc(sleeveSrc);
                        onLoadDraft(itemsArray, sleeveSrc, draft.id, draft.title);
                        // Show success toast notification
                        toast.success("Entwurf geladen");
                        // Set the currently selected draft ID
                        onSelectDraftId(draft.id);
                        // Close the modal after loading
                        onClose();
                      } catch (err) {
                        // Log any errors during draft parsing/loading
                        console.error("Error at parsing of the draft:", err);
                      }
                    }}
                    className="px-4 py-2 text-sm text-white rounded bg-agrotropic-blue hover:brightness-110"
                  >
                    Laden
                  </button>
                  {/* Delete draft button */}
                  <button
                    onClick={async () => {
                      try {
                        // Delete the draft from Supabase by ID
                        const { error } = await supabase.from("user_drafts").delete().eq("id", draft.id);

                        if (error) {
                          throw error;
                        }

                        // Remove the deleted draft from local state to update UI
                        setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                        // Show success toast notification
                        toast.success("Entwurf gelöscht");

                        // If the deleted draft is currently active, reset the canvas to default sleeve and selection
                        if (draft.id === currentDraftId) {
                          onLoadDraft(
                            [
                              {
                                id: "sleeve",
                                src: "/img/sleeves/sleeve1_v2.webp",
                                x: 0,
                                y: 0,
                                maxWidth: 800,
                                maxHeight: 800,
                                rotation: 0,
                                scale: 1,
                                type: "sleeve",
                                sleeveSrc: "/img/sleeves/sleeve1_v2.webp",
                                label: "Braun",
                              },
                            ],
                            "/img/sleeves/sleeve1_v2.webp",
                            undefined,
                            undefined
                          );
                          onSelectDraftId(null as unknown as string | undefined);
                        }
                      } catch (err) {
                        // Log and show error toast if deletion fails
                        console.error("Fehler beim Löschen des Entwurfs:", err);
                        toast.error("Fehler beim Löschen");
                      }
                    }}
                    className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
