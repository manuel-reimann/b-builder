import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase-client";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  draftId: string | null;
  defaultTitle: string;
  userId: string;
  prompt: string;
  materials_csv: string;
}

export default function ResultModal({
  open,
  onClose,
  imageUrl,
  draftId,
  defaultTitle,
  userId,
  prompt,
  materials_csv,
}: ResultModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  const handleDownloadAndSave = async () => {
    if (!imageUrl || !userId || !draftId) return;

    try {
      setLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = `flux-output-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage.from("user-images").upload(filename, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/png",
      });

      if (uploadError) {
        toast.error("Upload fehlgeschlagen");
        return;
      }

      const { data: publicData } = supabase.storage.from("user-images").getPublicUrl(filename);
      const publicUrl = publicData?.publicUrl;

      if (!publicUrl) {
        toast.error("Bild konnte nicht abgerufen werden");
        return;
      }

      // Save to final designs table
      const saveRes = await fetch("/api/save-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          image_url: publicUrl,
          prompt,
          title,
          materials_csv,
        }),
      });

      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        throw new Error(errorText);
      }

      toast.success("Bild erfolgreich gespeichert!");

      const link = document.createElement("a");
      link.href = publicUrl;
      link.download = "flux_output.png";
      link.click();

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Speichern oder Herunterladen");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generiertes Bild</h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Titel des Designs"
          />

          {loading ? (
            <div className="flex items-center justify-center h-48">⏳ Wird geladen...</div>
          ) : (
            imageUrl && <img src={imageUrl} alt="Result preview" className="w-full rounded shadow" />
          )}

          <div className="flex justify-end gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Schliessen
            </button>
            <button
              onClick={handleDownloadAndSave}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white rounded-md bg-agrotropic-green hover:bg-green-800"
            >
              Herunterladen &amp; Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
