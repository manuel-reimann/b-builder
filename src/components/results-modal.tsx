interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  defaultTitle: string;
}

export default function ResultModal({ open, onClose, imageUrl, defaultTitle }: ResultModalProps) {
  console.log("🟢 ResultModal mounted with defaultTitle:", defaultTitle);
  const handleDownloadAndSave = async () => {
    if (!imageUrl) return;

    console.log("⬇️ Download initiated for imageUrl:", imageUrl);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      console.log("📦 Blob created, preparing to download:", defaultTitle);
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${defaultTitle.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (!open) return null;
  console.log("🧱 ResultModal rendering with title:", defaultTitle);
  console.log("🧱 ResultModal rendering. Image URL:", imageUrl);

  return (
    <div key={defaultTitle} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{defaultTitle}</h2>

          {!imageUrl ? (
            <div className="flex items-center justify-center h-48 animate-pulse">🔄 Wird geladen...</div>
          ) : (
            <img src={imageUrl} alt="Generated Design" className="max-w-full max-h-[500px] mx-auto" />
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
