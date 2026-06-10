"use client";

// ========================================
// MENÚ SECRETO - ADMINISTRACIÓN
// Solo accesible escribiendo la URL
// ========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [batchNumber, setBatchNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ========================================
  // VACIAR TODAS LAS TABLAS
  // ========================================

  const handleResetAll = async () => {
    if (!window.confirm("¿Eliminar TODOS los lotes y QR? NO SE PUEDE DESHACER")) return;
    if (!window.confirm("Última oportunidad. ¿Estás SEGURO?")) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (res.ok) {
        setMessage("✅ Base de datos vaciada correctamente");
        router.refresh();
      } else {
        setMessage("❌ Error al vaciar la base de datos");
      }
    } catch {
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ELIMINAR UN LOTE
  // ========================================

  const handleDeleteBatch = async () => {
    if (!batchNumber) return;
    if (!window.confirm(`¿Eliminar lote ${batchNumber} y todos sus QR?`)) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/batch/${batchNumber}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage(`✅ Lote ${batchNumber} eliminado`);
        setBatchNumber("");
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error || "Error al eliminar"}`);
      }
    } catch {
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <div className="flex gap-3 mb-6">
        <Link
          href="/dashboard"
          className="text-sm rounded-xl bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 transition"
        >
          Dashboard
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
          }}
          className="text-sm rounded-xl border border-red-200 text-red-500 px-4 py-2 font-medium hover:bg-red-50 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-2xl font-bold mt-4 mb-6 text-slate-800">
        🔒 Administración
      </h1>

      {message && (
        <div className="bg-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* ELIMINAR LOTE */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-red-600 mb-4">
          Eliminar un lote
        </h2>

        <div className="flex gap-2">
          <input
            type="number"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Nº de lote"
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm"
            min="1"
          />
          <button
            onClick={handleDeleteBatch}
            disabled={loading || !batchNumber}
            className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* VACIAR TODO */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
        <h2 className="font-semibold text-red-600 mb-4">
          Zona peligrosa
        </h2>

        <button
          onClick={handleResetAll}
          disabled={loading}
          className="w-full bg-red-600 text-white p-4 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Eliminando..." : "🗑️ Vaciar toda la base de datos"}
        </button>
      </div>
    </main>
  );
}