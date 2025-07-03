import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LoginModal({
  onClose,
  onLogin,
  onSwitchToSignup,
}: {
  onClose: () => void;
  onLogin: (user: any) => void;
  onSwitchToSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Modal schliessen bei Klick auf Hintergrund
    >
      <div
        className="bg-white p-6 rounded w-80 shadow relative"
        onClick={(e) => e.stopPropagation()} // Klick innerhalb blockiert Schliessen
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-none bg-red-100 hover:bg-gray-100 text-gray-500 hover:text-red-600 text-xl"
          aria-label="Schliessen"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Login</h2>
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
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </div>
        <p className="mt-2 text-sm text-center">
          Noch keinen Account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline"
          >
            Jetzt registrieren
          </button>
        </p>
      </div>
    </div>
  );
}
