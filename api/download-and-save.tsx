import { useState } from "react";

interface ResultsModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  prompt: string;
  userId: string;
  title: string;
  materials_csv: string;
}

export function ResultsModal({ open, onClose, imageUrl, prompt, userId, title, materials_csv }: ResultsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !imageUrl) {
    return null;
  }

  const handleDownloadAndSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/download-and-save.tsx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          userId,
          prompt,
          title,
          materials_csv,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern");
      }

      alert("Erfolgreich gespeichert");
      onClose();
    } catch (error: any) {
      alert(`Fehler: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={prompt}
          style={{ maxWidth: "100%", maxHeight: "60vh", display: "block", marginBottom: 16 }}
        />
        <button
          onClick={handleDownloadAndSave}
          disabled={loading}
          style={{ padding: "8px 16px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Speichert..." : "Download und speichern"}
        </button>
        <button onClick={onClose} style={{ marginLeft: 8, padding: "8px 16px" }}>
          Schließen
        </button>
      </div>
    </div>
  );
}
