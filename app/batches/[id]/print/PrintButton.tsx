"use client";

// ========================================
// BOTÓN DE IMPRESIÓN (CLIENTE)
// Necesario porque usa window.print()
// ========================================

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
    >
      🖨️ Imprimir lote
    </button>
  );
}