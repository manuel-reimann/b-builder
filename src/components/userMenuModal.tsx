// filename: UserMenuModal.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    setLoading(false);

    if (error) {
      setMessage("Update failed");
    } else {
      setMessage("Name updated");
      refreshUser(); // hole neue Userdaten
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Your Profile</h2>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Enter name"
        />

        {message && <p className="text-sm mb-2">{message}</p>}

        <div className="flex justify-between items-center">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>

          <button
            onClick={onLogout}
            className="text-red-600 hover:underline text-sm"
          >
            Logout
          </button>

          <button
            onClick={onClose}
            className="text-gray-600 hover:underline text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
