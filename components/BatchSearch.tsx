"use client";

// ========================================
// BUSCADOR DE LOTES
// Filtra por nombre o número
// ========================================

import { useState } from "react";
import Link from "next/link";

interface Batch {
  id: string;
  batchNumber: number;
  name: string;
  printedAt: string | null;
  qrSizeMm: number;
  _count: { qrs: number };
}

interface Props {
  batches: Batch[];
}

export default function BatchSearch({ batches }: Props) {
  const [search, setSearch] = useState("");

  const filtered = batches.filter((batch) => {
    const term = search.toLowerCase();
    return (
      batch.name.toLowerCase().includes(term) ||
      batch.batchNumber.toString().includes(term)
    );
  });

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar lote..."
        className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm mb-4 text-sm"
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-100 p-4 text-sm text-slate-400 shadow-sm">
            {search ? "Sin resultados" : "No hay lotes todavía"}
          </div>
        ) : (
          filtered.map((batch) => (
            <Link
              key={batch.id}
              href={`/batches/${batch.id}`}
              className="block rounded-xl bg-white border border-slate-100 p-4 hover:border-indigo-200 hover:shadow-md shadow-sm transition relative"
            >
              <span className="absolute top-3 right-3 text-[10px] text-indigo-500 font-medium">
                Detalles
              </span>
              <div className="font-semibold text-slate-800 flex items-center gap-2">
                Lote {batch.batchNumber}
                {batch.printedAt && (
                  <span className="text-indigo-500 text-xs font-normal ml-1">✓ Impreso</span>
                )}
              </div>

              <div className="text-sm text-slate-500">{batch.name}</div>

              <div className="text-sm mt-2 flex items-center gap-2 text-slate-500">
                {batch._count.qrs} QR
                <span className="text-slate-400">·</span>
                <span>{batch.qrSizeMm || 30}mm</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}