import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";
import { CanvasItem } from "./canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// Initialize Supabase client using environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

// DraftsModal component props definition and component itself
export default function DraftsModal({ userId, onClose, onLoadDraft, setSleeveSrc, onSelectDraftId, currentDraftId }: { userId: string; onClose: () => void; onLoadDraft: (items: CanvasItem[], sleeveSrc?: string, draftId?: string, draftTitle?: string, backgroundImage?: string) => void; setSleeveSrc: (src: string) => void; onSelectDraftId: (id?: string | null) => void; currentDraftId: string | null }) {
  // State to hold the list of drafts fetched from the database
  const [drafts, setDrafts] = useState<any[]>([]);
  // Loading state to indicate whether drafts are being fetched
  const [loading, setLoading] = useState(true);
  // State to track which draft title is being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  // useEffect hook to fetch drafts when the component mounts or when userId changes
  useEffect(() => {
    const fetchDrafts = async () => {
      // Query Supabase to get drafts for the current user, ordered by creation date descending
      const { data, error } = await supabase.from("user_drafts").select("id, title, elements, sleeve, background, created_at").eq("user_id", userId).order("created_at", { ascending: false });

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

  // Sort drafts to put the current draft on top
  const sortedDrafts = [...drafts].sort((a, b) => {
    if (a.id === currentDraftId) return -1;
    if (b.id === currentDraftId) return 1;
    return 0;
  });

  // Render the modal UI
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button for the modal */}
        <span onClick={onClose} className="absolute p-1 text-3xl leading-none transition-colors rounded-full cursor-pointer top-2 right-4 hover:text-red-600" aria-label="Schliessen">
          x
        </span>
        {/* Modal title */}
        <h2 className="mb-4 text-2xl font-semibold">Meine Entwürfe</h2>
        {/* Conditional rendering based on loading state and drafts availability */}
        {loading ? (
          <p>Loading...</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-500">Noch keine Entwürfe gespeichert.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Map over drafts to display each draft */}
            {sortedDrafts.map((draft) => (
              <div key={draft.id} className={`flex flex-col items-center p-4 border rounded shadow relative ${draft.id === currentDraftId ? "bg-gray-100 border-agrotropic-blue" : ""}`}>
                {/* Editable title input and save button for current draft */}
                {editingId === draft.id ? (
                  <div className="flex items-center gap-1 mb-1 text-lg font-semibold text-center">
                    <input type="text" className="px-1 text-center border border-gray-300 rounded" value={draft.title || ""} onChange={(e) => setDrafts((prev) => prev.map((d) => (d.id === draft.id ? { ...d, title: e.target.value } : d)))} />
                    <span
                      onClick={async () => {
                        const trimmed = draft.title?.trim();
                        if (!trimmed) return;
                        const { error } = await supabase.from("user_drafts").update({ title: trimmed }).eq("id", draft.id);
                        if (error) {
                          toast.error("Fehler beim Umbenennen");
                          console.error("Rename error:", error);
                        } else {
                          toast.success("Titel aktualisiert");
                        }
                        setEditingId(null);
                      }}
                      title="Speichern"
                      className="px-1 text-sm text-green-600 hover:text-green-800 hover:cursor-pointer"
                    >
                      &nbsp;✅
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mb-1 text-lg font-semibold text-center">
                    <span>{draft.title || "(Ohne Titel)"}</span>
                    <span onClick={() => setEditingId(draft.id)} title="Titel bearbeiten" className="text-gray-500 hover:text-black">
                      &nbsp;
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </span>
                  </div>
                )}
                {/* Draft creation date formatted */}
                <p className="mb-4 text-sm text-gray-600">{new Date(draft.created_at).toLocaleString()}</p>
                <div className="flex flex-row gap-2 mt-2">
                  {/* Load draft button: loads the draft into the canvas and closes the modal */}
                  {draft.id !== currentDraftId && (
                    <button
                      onClick={() => {
                        // Load the selected draft into the canvas
                        try {
                          // Clear any previously selected draft ID
                          onSelectDraftId("");

                          // Get background key from column (may be draft name without extension)
                          const backgroundKey: string | undefined = draft.background ?? undefined;
                          // Extract all items and identify the background item
                          const allItems: CanvasItem[] = Array.isArray(draft.elements) ? draft.elements : [];
                          const backgroundItemFromElements = allItems.find((item) => item.type === "background" || (typeof item.src === "string" && item.src.startsWith("/img/bgs/")));
                          // Remove background and sleeve items from canvas items
                          const canvasItems: CanvasItem[] = allItems.filter((item) => item.type !== "background" && item.type !== "sleeve");
                          // Determine final background src: prefer the element's src, fall back to stored key only if it's a valid url or filename
                          const finalBackgroundSrc: string | undefined = backgroundItemFromElements?.src ?? (backgroundKey && (backgroundKey.includes(".") || backgroundKey.startsWith("/") || backgroundKey.startsWith("http")) ? backgroundKey : undefined);
                          // Resolve full URL for legacy or key-based backgrounds
                          const resolvedBackgroundUrl: string | undefined = finalBackgroundSrc ? (finalBackgroundSrc.startsWith("http") || finalBackgroundSrc.startsWith("/") ? finalBackgroundSrc : `${import.meta.env.BASE_URL}img/bgs/${finalBackgroundSrc}.webp`) : undefined;

                          // Apply background
                          if (resolvedBackgroundUrl) {
                            document.body.style.backgroundImage = `url(${resolvedBackgroundUrl})`;
                            document.body.style.backgroundSize = "cover";
                          } else {
                            console.log("No background found in draft.");
                          }

                          // Sleeve remains separate
                          const sleeveSrc: string = draft.sleeve || "";
                          setSleeveSrc(sleeveSrc);
                          onLoadDraft(canvasItems, sleeveSrc, draft.id, draft.title, resolvedBackgroundUrl);
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
                  )}
                  {/* Delete draft button: deletes the draft from the database and updates UI */}
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
                                src: "/img/sleeves/vm961_v2.webp",
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
