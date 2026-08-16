"use client";

// ========================================
// NUEVO LOTE - DESHABILITADO TEMPORALMENTE
// Ruta: /batches/new
// ========================================

import Link from "next/link";

export default function NewBatchPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          Función temporalmente deshabilitada
        </h1>
        <p className="text-slate-600 mb-6">
          La creación de nuevos lotes está en mantenimiento. Por favor, contacta con soporte para más información.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          ← Volver al panel
        </Link>
      </div>
    </main>
  );
}