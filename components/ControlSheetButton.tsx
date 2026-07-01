"use client";

// ========================================
// BOTÓN HOJA DE CONTROL
// Abre el modal con opciones
// ========================================

import { useState } from "react";
import ControlSheetModal from "./ControlSheetModal";

interface Props {
  batchId: string;
}

export default function ControlSheetButton({ batchId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-purple-600 text-white px-3 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 shadow-sm shadow-purple-200 transition"
      >
        📋 Hoja de control
      </button>
      <ControlSheetModal
        open={open}
        batchId={batchId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}