import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (user: any) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // ✅ Info für Erfolgsmeldungen

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user); // ✅ übergibt den eingeloggenen User
      onClose();
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    // 1. Registriere User inkl. name in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // kommt in user.user_metadata.name
      },
    });

    // 2. Hole aktuellen User nach Signup
    const user = (await supabase.auth.getUser()).data.user;

    // 3. Fallback: falls metadata nicht gespeichert wurde → nachträglich setzen
    if (user && !user.user_metadata?.name) {
      await supabase.auth.updateUser({
        data: { name },
      });
    }

    if (error) {
      alert(error.message);
    } else {
      alert("Bitte bestätige deine E-Mail-Adresse");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-lg font-semibold mb-4">Login / Registrierung</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
        <div className="flex justify-between gap-2">
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Registrieren
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
