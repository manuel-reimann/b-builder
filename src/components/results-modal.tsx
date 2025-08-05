import { useEffect, useState } from "react";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export default function ResultModal({ open, onClose, imageUrl, title }: ResultModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("🟢 ResultModal mounted with title:", title);
  }, [title]);

  const handleDownloadAndSave = async () => {
    if (!imageUrl) return;

    console.log("⬇️ Download initiated for imageUrl:", imageUrl);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Server response ${response.status}`);
      }

      const blob = await response.blob();
      console.log("📦 Blob created, preparing to download:", title);
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
      setErrorMessage(null); // Reset error if successful
    } catch (error: any) {
      console.error("Download error:", error);
      setErrorMessage("Bild konnte nicht geladen werden. Bitte versuche es erneut.");
    }
  };

  if (!open) return null;

  return (
    <div key={title} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {errorMessage && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">{errorMessage}</div>}

          {!imageUrl ? <div className="flex items-center justify-center h-48 animate-pulse">🔄 Wird geladen...</div> : <img src={imageUrl} alt="Generated Design" className="max-w-full max-h-[500px] mx-auto" />}

          <div className="flex justify-end gap-4 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Schliessen
            </button>
            {!errorMessage ? (
              <button onClick={handleDownloadAndSave} className="px-4 py-2 text-sm font-medium text-white rounded-md bg-agrotropic-green hover:bg-green-800">
                Herunterladen
              </button>
            ) : (
              <button onClick={handleDownloadAndSave} className="px-4 py-2 text-sm font-medium text-white rounded-md bg-agrotropic-blue hover:bg-agrotropic-blue/80">
                Nochmal versuchen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
