"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700"
    >
      🖨️ Imprimir
    </button>
  );
}