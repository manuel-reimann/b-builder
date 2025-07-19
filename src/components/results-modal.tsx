import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  const handleDownloadAndSave = async () => {
    if (!imageUrl || !userId || !draftId) return;
    console.log("Start Download & Save", { imageUrl, userId, draftId });

    try {
      setLoading(true);

      const response = await fetch(imageUrl);
      console.log("Fetched image response", response);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        console.log("Image loaded as base64", reader.result);
        const base64data = reader.result;

        console.log("POSTing to download-and-save API", {
          imageDataUrl: base64data,
          userId,
          title,
          prompt,
          materials_csv,
        });
        const res = await fetch("/api/download-and-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: base64data,
            userId,
            title,
            prompt,
            materials_csv,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const { publicUrl } = await res.json();
        console.log("Received publicUrl from API", publicUrl);

        setFinalImageUrl(publicUrl);

        const link = document.createElement("a");
        link.href = publicUrl;
        link.download = "flux_output.png";
        link.click();

        toast.success("Bild erfolgreich gespeichert!");
        onClose();
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Speichern oder Herunterladen");
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

          {loading || !finalImageUrl ? (
            <div className="flex items-center justify-center h-48">⏳ Wird geladen...</div>
          ) : (
            <img src={finalImageUrl} alt="Result preview" className="w-full rounded shadow" />
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
