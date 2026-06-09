"use client";

// ========================================
// NUEVO LOTE
// Ruta: /batches/new
// ========================================

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBatchPage() {
  const router = useRouter();

  // ========================================
  // ESTADO FORMULARIO
  // ========================================

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [qrSize, setQrSize] = useState(30);

    async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          quantity,
          qrSizeMm: qrSize,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear lote");
      }

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message || "Error al crear lote");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* VOLVER */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Volver
        </Link>
      </div>

      {/* CABECERA */}
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Crear lote
      </h1>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NOMBRE DEL LOTE */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-600">
            Nombre del lote
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Ej: Junio 2026"
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>
		
		{/* TAMAÑO QR */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-600">
            Tamaño QR (mm)
          </label>

          <input
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            type="number"
            min="15"
            max="100"
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* CANTIDAD QR */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-600">
            Cantidad de QR
          </label>

          <input
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            type="number"
            min="1"
            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* BOTÓN CREAR */}
                <button
          type="submit"
          disabled={loading}
          onClick={(e) => {
            if (
              !window.confirm(
                `¿Crear lote "${name || "Sin nombre"}" con ${quantity} QR?`
              )
            ) {
              e.preventDefault();
            }
          }}
          className="w-full rounded-xl bg-indigo-600 text-white p-4 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
        >
          {loading ? "Creando..." : "Crear lote"}
        </button>
      </form>
    </main>
  );
}