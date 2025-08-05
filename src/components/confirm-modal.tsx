import { FC } from "react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-6 bg-white rounded shadow w-96">
        <h2 className="mb-4 text-lg font-semibold">Bestätigung erfolgreich</h2>
        <p>Dein Account wurde bestätigt und du bist jetzt eingeloggt. Viel Spass!</p>
        <p className="mt-2 text-sm text-gray-600">Hinweis: Generative KI kann Fehler machen.</p>
        <p className="mt-2 text-sm text-gray-600">
          Fehler entstehen häufig durch schwierige Ausgangsbilder oder Modellannahmen. Erfahre mehr dazu:{" "}
          <a href="https://builtin.com/artificial-intelligence/hallucination-ai" target="_blank" rel="noopener noreferrer" className="text-agrotropic-blue hover:underline">
            Warum Bilder manchmal nicht exakt sind
          </a>
          .
        </p>
        <button onClick={onClose} className="px-4 py-2 mt-6 text-white rounded bg-agrotropic-green">
          OK
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
