import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY);

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

    if (error || data?.user?.identities?.length === 0) {
      setError(error?.message || "Diese E-Mail ist bereits registriert oder ein anderer Fehler ist aufgetreten.");
      return;
    }

    if (!data.user) {
      setError("Es konnte kein Benutzer erstellt werden.");
      return;
    }

    setMessage("Bitte bestätige deine E-Mail-Adresse");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative p-6 bg-white rounded shadow w-80" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute text-lg text-gray-500 top-2 right-2 hover:text-red-600"
          aria-label="Schliessen"
        >
          &times;
        </button>
        <h2 className="mb-4 text-lg font-semibold">Registrieren</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
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
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        {message && <p className="mb-2 text-sm text-green-600">{message}</p>}

        <div className="flex">
          <button onClick={handleSignup} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
            Registrieren
          </button>
        </div>
        <p className="mt-2 text-sm text-center">
          Bereits registriert?{" "}
          <span onClick={onSwitchToLogin} className="text-blue-600 cursor-pointer hover:underline">
            Zurück zum Login
          </span>
        </p>
      </div>
    </div>
  );
}
