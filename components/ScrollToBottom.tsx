"use client";

// ========================================
// BOTÓN BAJAR A ACCIONES
// Desaparece al llegar a los botones
// ========================================

import { useEffect, useState } from "react";

export default function ScrollToBottom() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const actions = document.getElementById("batch-actions");
      if (actions) {
        const rect = actions.getBoundingClientRect();
        setVisible(rect.top > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 flex flex-col items-center gap-1 z-50">
      <span className="text-[10px] text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5 font-medium">
        Acciones
      </span>
      <button
        onClick={() =>
          document.getElementById("batch-actions")?.scrollIntoView({ behavior: "smooth" })
        }
        className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition text-xl"
        aria-label="Ir a acciones"
      >
        ↓
      </button>
    </div>
  );
}