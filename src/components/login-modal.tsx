import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

console.log("INIT SUPABASE vo login-modal.tsx", import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function LoginModal({ onClose, onLogin, onSwitchToSignup, infoMessage }: { onClose: () => void; onLogin: (user: any) => void; onSwitchToSignup: () => void; infoMessage?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // close modal on outside click
    >
      <div
        className="relative p-6 bg-white rounded shadow w-80"
        onClick={(e) => e.stopPropagation()} // close inside of modal is not triggered by outside click
      >
        <span onClick={onClose} className="absolute p-1 text-3xl leading-none transition-colors rounded-full cursor-pointer top-2 right-4 hover:text-red-600" aria-label="Schliessen">
          x
        </span>
        <h2 className="mb-4 text-lg font-semibold">Login</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
        {error && <p className="mb-2 text-red-500 text-md">{error}</p>}
        {infoMessage && <p className="mb-2 text-green-600 text-md">{infoMessage}</p>}
        <div className="flex justify-between gap-2">
          <button onClick={handleLogin} className="w-full px-4 py-2 text-white rounded bg-agrotropic-green hover:bg-green-900">
            Login
          </button>
        </div>
        {!infoMessage && (
          <p className="mt-8 text-center text-md">
            Noch keinen Account?{" "}
            <button onClick={onSwitchToSignup} className="mt-2 text-white bg-agrotropic-blue hover:bg-gray-500">
              Jetzt registrieren
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
