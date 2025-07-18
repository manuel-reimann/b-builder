import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import leoProfanity from "leo-profanity";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function UserMenuModal({
  user,
  onClose,
  onLogout,
  refreshUser,
}: {
  user: any;
  onClose: () => void;
  onLogout: () => void;
  refreshUser: () => void;
}) {
  const [name, setName] = useState(user.user_metadata?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    leoProfanity.loadDictionary("de");
    leoProfanity.add(["arsch", "arschloch", "hurensohn", "wichser", "ficker", "scheisse", "fotze", "bastard"]);
    if (leoProfanity.check(name)) {
      setMessage("Bitte verwende keine unangebrachten Begriffe.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    setLoading(false);

    if (error) {
      setMessage("Update failed");
    } else {
      setMessage("Name updated");
      refreshUser(); // get new userdate
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white w-96 max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative">
        <h2 className="mb-4 text-lg font-semibold">Your Profile</h2>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
          placeholder="Enter name"
        />

        {message && <p className="mb-2 text-sm">{message}</p>}

        <div className="flex items-center justify-between">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>

          <button onClick={onLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>

          <button onClick={onClose} className="text-sm text-gray-600 hover:underline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
