import { useState } from "react";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  defaultTitle: string;
}

export default function ResultModal({ open, onClose, imageUrl, defaultTitle }: ResultModalProps) {
  const [loading] = useState(false);
  const [title, setTitle] = useState(defaultTitle);

  const handleDownloadAndSave = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "flux_output.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {loading || !imageUrl ? (
            <div className="flex items-center justify-center h-48">⏳ Wird geladen...</div>
          ) : (
            imageUrl && <img src={imageUrl} alt="Generated Design" className="max-w-full max-h-[500px] mx-auto" />
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
