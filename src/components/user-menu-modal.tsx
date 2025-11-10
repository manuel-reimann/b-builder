import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import leoProfanity from "leo-profanity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function UserMenuModal({ user, onClose, onLogout, refreshUser }: { user: any; onClose: () => void; onLogout: () => void; refreshUser: () => void }) {
  // State for the user's (possibly edited) name input
  const [name, setName] = useState(user.user_metadata?.name || "");
  // State for the original name to revert if needed
  const [originalName, setOriginalName] = useState(user.user_metadata?.name || "");
  // State for displaying success or error messages
  const [message, setMessage] = useState("");
  // State for toggling name edit mode
  const [editing, setEditing] = useState(false);
  // State for user's draft count statistic
  const [draftCount, setDraftCount] = useState<number | null>(null);
  // State for user's design count statistic
  const [designCount, setDesignCount] = useState<number | null>(null);

  // Fetch user statistics (draft and design counts) when the modal loads or user changes
  useEffect(() => {
    const fetchStats = async () => {
      const { count: draftCount } = await supabase.from("user_drafts").select("*", { count: "exact", head: true }).eq("user_id", user.id);

      const { count: designCount } = await supabase.from("user_designs").select("*", { count: "exact", head: true }).eq("user_id", user.id);

      setDraftCount(draftCount ?? 0);
      setDesignCount(designCount ?? 0);
    };

    fetchStats();
  }, [user.id]);

  const handleUpdate = async () => {
    // Load German profanity dictionary and add custom words
    leoProfanity.loadDictionary("de");
    leoProfanity.add(["arsch", "arschloch", "hurensohn", "wichser", "ficker", "scheisse", "fotze", "bastard"]);
    // Profanity filtering: Check if name contains inappropriate words
    if (leoProfanity.check(name)) {
      setMessage("Bitte verwende keine unangebrachten Begriffe.");
      setName(originalName);
      return;
    }
    // Update user name in Supabase
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });

    // Error handling and message display
    if (error) {
      setMessage("Name konnte nicht aktualisiert werden: " + error.message);
      setName(originalName);
    } else {
      setMessage("Name wurde aktualisiert");
      setOriginalName(name);
      refreshUser(); // get new user data
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-96 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        {/* Greeting section */}
        <p className="mb-4 text-lg font-semibold text-gray-800">Hallo {name || "Nutzer"}</p>

        {/* Statistics section */}
        <div className="mb-4 text-gray-600 text-md">
          <p>Du hast bereits erstellt:</p>
          <p> Entwürfe: {draftCount ?? "–"} </p>
          <p> Designs: {designCount ?? "–"} </p>
        </div>

        {/* Name editing toggle section */}
        <div className="flex items-center gap-2 mb-4">
          {editing ? (
            <>
              {/* Input for editing name, visible when editing */}
              <input type="text" className="w-full px-1 py-1 text-center border border-gray-300 rounded" value={name} onChange={(e) => setName(e.target.value)} />
              {/* Save button for name update */}
              <span
                onClick={async () => {
                  await handleUpdate();
                  setEditing(false);
                }}
                title="Speichern"
                className="px-1 text-sm text-green-600 hover:text-green-800 hover:cursor-pointer"
              >
                ✅
              </span>
            </>
          ) : (
            <>
              {/* Display name and edit icon when not editing */}
              <span className="font-medium text-md">Name bearbeiten: {name || "–"}</span>
              <span onClick={() => setEditing(true)} title="Bearbeiten" className="text-sm text-gray-600 hover:text-black hover:cursor-pointer">
                <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
              </span>
            </>
          )}
        </div>

        {/* Message display (success or error) */}
        {message && <p className={`mb-2 text-sm ${message.toLowerCase().includes("nicht") || message.toLowerCase().includes("bitte") ? "text-red-600" : "text-green-600"}`}>{message}</p>}

        {/* Close button (X) */}
        <span onClick={onClose} className="absolute p-1 text-3xl leading-none transition-colors rounded-full cursor-pointer top-2 right-4 hover:text-red-600" aria-label="Schliessen">
          x
        </span>

        {/* Logout button */}
        <button onClick={onLogout} className="block w-48 px-4 py-2 mx-auto mt-4 text-white bg-red-600 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}
