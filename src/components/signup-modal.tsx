import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function SignupModal({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: (message: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    const successMsg = "Erfolgreich registriert! Bitte bestätige deine E-Mail-Adresse.";
    onSwitchToLogin(successMsg);
    onClose();
    return;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative p-6 bg-white rounded shadow w-80" onClick={(e) => e.stopPropagation()}>
        <span onClick={onClose} className="absolute p-1 text-3xl leading-none transition-colors rounded-full cursor-pointer top-2 right-4 hover:text-red-600" aria-label="Schliessen">
          x
        </span>
        <h2 className="mb-4 text-lg font-semibold">Registrieren</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" />
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        <div className="flex">
          <button onClick={handleSignup} className="w-full px-4 py-2 text-white rounded bg-agrotropic-green hover:bg-green-900">
            Registrieren
          </button>
        </div>
        <p className="mt-2 text-center text-md">
          Bereits registriert? <br />
          <span onClick={() => onSwitchToLogin("")} className="cursor-pointer text-agrotropic-green hover:text-agrotropic-green/80">
            Zurück zum Login
          </span>
        </p>
      </div>
    </div>
  );
}
