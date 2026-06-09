"use client";

// ========================================
// MODAL DE CONFIRMACIÓN
// Diálogo elegante para confirmar acciones
// ========================================

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* FONDO OSCURO */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* TARJETA MODAL */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-toast-in">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 p-3 text-slate-600 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-indigo-600 text-white p-3 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
          >
            {loading ? "Creando..." : "✓ Crear lote"}
          </button>
        </div>
      </div>
    </div>
  );
}