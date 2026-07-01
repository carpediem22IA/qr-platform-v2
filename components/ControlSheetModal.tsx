"use client";

// ========================================
// MODAL HOJA DE CONTROL
// Elige entre imprimir o control digital
// ========================================

import Link from "next/link";

interface Props {
  open: boolean;
  batchId: string;
  onClose: () => void;
}

export default function ControlSheetModal({ open, batchId, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-toast-in">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          📋 Hoja de control
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Elige cómo gestionar el pegado de QR
        </p>

        <div className="space-y-3">
          <Link
            href={`/batches/${batchId}/print`}
            className="block w-full rounded-xl bg-indigo-600 text-white p-4 text-center font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
          >
            🖨️ Imprimir listado
          </Link>
          <Link
            href={`/dashboard/control/${batchId}`}
            className="block w-full rounded-xl bg-emerald-600 text-white p-4 text-center font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition"
          >
            📝 Control en pantalla
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 p-3 text-slate-500 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}