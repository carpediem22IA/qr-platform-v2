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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setVisible(rect.top > window.innerHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  if (!visible) return null;

  return (
    <div className="fixed top-12 right-2 flex flex-col items-center gap-1 z-50">
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