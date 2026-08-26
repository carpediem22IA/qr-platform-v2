"use client";

// ========================================
// NUEVO LOTE
// Ruta: /batches/new
// ========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBatchPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [qrSizeMm, setQrSizeMm] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          quantity: Number(quantity),
          qrSizeMm: Number(qrSizeMm),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/batches/${data.id}`);
        router.refresh();
      } else {
        setError(data.error || "Error al crear lote");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* CABECERA */}
      <Link
        href="/dashboard"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Volver al panel
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6 text-slate-800">
        ➕ Crear nuevo lote
      </h1>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NOMBRE DEL LOTE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del lote *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: PDF Definitivo"
            required
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* CANTIDAD DE QR */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cantidad de QR *
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ej: 100"
            min="1"
            max="1000"
            required
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          <p className="text-xs text-slate-400 mt-1">
            Entre 1 y 1000 QR por lote
          </p>
        </div>

        {/* TAMAÑO DEL QR */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tamaño del QR (mm)
          </label>
          <input
            type="number"
            value={qrSizeMm}
            onChange={(e) => setQrSizeMm(e.target.value)}
            min="10"
            max="100"
            required
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          <p className="text-xs text-slate-400 mt-1">
            Recomendado: 30 mm (mínimo 10, máximo 100)
          </p>
        </div>

        {/* BOTÓN CREAR */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 text-white p-4 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
        >
          {loading ? "Creando..." : "➕ Crear lote"}
        </button>
      </form>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h2 className="text-sm font-medium text-slate-700 mb-3">
          ℹ️ Información
        </h2>
        <ul className="text-xs text-slate-500 space-y-2">
          <li>• Cada QR tendrá un token único de 6 caracteres</li>
          <li>• Los QR se numerarán automáticamente</li>
          <li>• Podrás imprimirlos en PDF después</li>
          <li>• Se creará un backup automático del lote</li>
        </ul>
      </div>
    </main>
  );
}