import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SignupModal({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSignup: (user: any) => void;
  onSwitchToLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Bitte bestätige deine E-Mail-Adresse");
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-lg font-semibold mb-4">Registrieren</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleSignup}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrieren
          </button>
          <button
            onClick={onSwitchToLogin}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Login
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
