"use client";

// ========================================
// BUSCADOR DE QR DENTRO DE UN LOTE
// ========================================

import { useState } from "react";
import Link from "next/link";

interface QRData {
  qrNumber: number;
  token: string;
  status: string;
  batchId: string;
}

interface Props {
  qrs: QRData[];
  batchId: string;
}

export default function BatchQRSearch({ qrs, batchId }: Props) {
  const [search, setSearch] = useState("");

  const filtered = qrs.filter((qr) => {
    const term = search.toLowerCase();
    if (!term) return true;
    return (
      qr.token.toLowerCase().includes(term) ||
      qr.qrNumber.toString().padStart(4, "0").includes(term)
    );
  });

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar QR por número o token..."
        className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
      />

      {(
        <div className="mt-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-slate-400 text-center p-2">
              Sin resultados
            </div>
          ) : (
            filtered.map((qr) => (
              <Link
                key={qr.token}
                href={`/qr/${qr.token}/view`}
                className="block rounded-xl bg-white border border-slate-100 p-3 hover:border-indigo-200 hover:shadow-sm shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-slate-800">
                      QR {qr.qrNumber.toString().padStart(4, "0")}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {qr.token}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      qr.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {qr.status === "ACTIVE" ? "Activo" : "Usado"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </>
  );
}