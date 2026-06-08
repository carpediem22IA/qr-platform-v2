"use client";

// ========================================
// BOTÓN IMPRIMIR TODOS LOS QR
// ========================================

export default function PrintAllButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
    >
      🖨️ Imprimir todos
    </button>
  );
}