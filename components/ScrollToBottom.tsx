"use client";

// ========================================
// BOTÓN BAJAR A ACCIONES
// Desaparece al llegar al objetivo
// ========================================

import { useEffect, useState } from "react";

interface Props {
  targetId: string;
}

export default function ScrollToBottom({ targetId }: Props) {
  //const [visible, setVisible] = useState(true);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const isOutOfView = rect.top > window.innerHeight;
        setVisible(window.scrollY > 300 && isOutOfView);
      }
    };

    // Verificar después de un pequeño delay para que el DOM esté listo
    setTimeout(checkVisibility, 100);

    window.addEventListener("scroll", checkVisibility);
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [targetId]);

  if (!visible) return null;

  return (
    <div className="fixed top-12 right-2 flex flex-col items-end gap-1 z-50">
      <span className="text-[10px] text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5 font-medium">
        Acciones
      </span>
      <button
        onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
        className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition text-xl"
        aria-label="Ir a acciones"
      >
        ↓
      </button>
    </div>
  );
}