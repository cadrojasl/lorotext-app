"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authError) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        setLoading(false);
      } else {
        router.refresh();
        router.push("/admin/productos");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#F8F6F1" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="rounded-full overflow-hidden bg-white shadow-md mx-auto mb-3" style={{ width: 64, height: 64 }}>
            <Image src="/logo.png" alt="Lorotext SYM" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="font-bold text-xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Panel Administrador
          </h1>
          <p className="text-xs text-gray-400 mt-1">Lorotext SYM</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: BRAND.BLUE }}
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
          <a href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}
