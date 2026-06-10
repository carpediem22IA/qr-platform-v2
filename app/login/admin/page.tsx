"use client";

// ========================================
// LOGIN MASTER - ACCESO PANEL OCULTO
// ========================================

import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function LoginMasterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard/admin");
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Contraseña maestra
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
          autoFocus
        />
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-red-600 text-white p-4 font-medium hover:bg-red-700 disabled:opacity-50 transition"
      >
        {loading ? "Accediendo..." : "Acceder"}
      </button>
    </form>
  );
}

export default function LoginMasterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-800">
            Acceso Maestro
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Panel de administración avanzada
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <Suspense fallback={<div>Cargando...</div>}>
            <LoginMasterForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}