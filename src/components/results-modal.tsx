import { useState } from "react";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export default function ResultModal({ open, onClose, imageUrl, title }: ResultModalProps) {
  const [loading] = useState(false);

  const handleDownloadAndSave = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{title}</h2>

          {loading || !imageUrl ? (
            <div className="flex items-center justify-center h-48 animate-pulse">🔄 Wird geladen...</div>
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
              Herunterladen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
