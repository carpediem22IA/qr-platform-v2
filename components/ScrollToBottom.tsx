"use client";

// ========================================
// BOTÓN BAJAR A ACCIONES
// ========================================

export default function ScrollToBottom() {
  return (
    <button
      onClick={() =>
        document.getElementById("batch-actions")?.scrollIntoView({ behavior: "smooth" })
      }
      className="fixed top-20 right-6 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition text-xl z-50"
      aria-label="Ir a acciones"
    >
      ↓
    </button>
  );
}