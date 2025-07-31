import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

console.log("INIT SUPABASE vo login-modal.tsx", import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function LoginModal({ onClose, onLogin, onSwitchToSignup }: { onClose: () => void; onLogin: (user: any) => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message] = useState("");

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
        <button onClick={onClose} className="absolute text-xl text-gray-500 bg-red-100 top-2 right-2 bg-none hover:bg-gray-100 hover:text-red-600" aria-label="Schliessen">
          &times;
        </button>
        <h2 className="mb-4 text-lg font-semibold">Login</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
        <div className="flex justify-between gap-2">
          <button onClick={handleLogin} className="w-full px-4 py-2 text-white rounded bg-agrotropic-green hover:bg-green-900">
            Login
          </button>
        </div>
        <p className="mt-8 text-center text-md">
          Noch keinen Account?{" "}
          <button onClick={onSwitchToSignup} className="mt-2 text-white bg-agrotropic-blue hover:bg-gray-500">
            Jetzt registrieren
          </button>
        </p>
      </div>
    </div>
  );
}
