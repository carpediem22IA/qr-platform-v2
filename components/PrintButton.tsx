"use client";

// ========================================
// BOTÓN DE IMPRESIÓN (CLIENTE)
// Marca el lote como impreso y
// luego abre la ventana de impresión
// ========================================

import { useState } from "react";

interface Props {
  batchId: string;
}

export default function PrintButton({ batchId }: Props) {
  const [loading, setLoading] = useState(false);

    const handlePrint = async () => {
    setLoading(true);

    // Marcar lote como impreso
    const res = await fetch(`/api/batches/${batchId}/print`, {
      method: "POST",
    });
    console.log("API print response:", res.status);

    setLoading(false);
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
    >
      {loading ? "Preparando..." : "🖨️ Imprimir lote"}
    </button>
  );
}