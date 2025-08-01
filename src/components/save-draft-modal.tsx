import { useState } from "react";

type SaveDraftModalProps = {
  onClose: () => void;
  onSave: (title: string, backgroundSrc?: string) => void;
};

export default function SaveDraftModal({ onClose, onSave }: SaveDraftModalProps) {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-xl font-semibold">Neuen Entwurf speichern</h2>
        <input type="text" className="w-full p-2 mb-4 border rounded" placeholder="Titel des Entwurfs" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 text-white bg-red-400 rounded hover:bg-red-500" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="px-4 py-2 text-white rounded bg-agrotropic-blue hover:bg-gray-800"
            onClick={() => {
              const trimmedTitle = title.trim();
              if (trimmedTitle) {
                let fallbackBg = "";
                try {
                  const bgImage = getComputedStyle(document.body).backgroundImage;
                  const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
                  if (match) fallbackBg = match[1];
                } catch {}
                onSave(trimmedTitle, fallbackBg);
                onClose(); // Close modal immediately after save
              }
            }}
            disabled={!title.trim()}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
