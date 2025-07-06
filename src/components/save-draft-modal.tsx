// save-draft-modal.tsx
import { useState } from "react";
import { toast } from "react-toastify";

type SaveDraftModalProps = {
  onClose: () => void;
  onSave: (title: string) => void;
};

export default function SaveDraftModal({ onClose, onSave }: SaveDraftModalProps) {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-xl font-semibold">Neuen Entwurf speichern</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Titel des Entwurfs"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={() => {
              onSave(title);
              toast.success("Entwurf gespeichert!");
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
