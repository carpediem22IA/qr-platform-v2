"use client";

// ========================================
// LISTADO DE QR CON BUSCADOR
// Filtra y mantiene los botones de acción
// ========================================

import { useState } from "react";
import Link from "next/link";
import ResetButton from "./ResetButton";
import DeactivateButton from "./DeactivateButton";

interface QRData {
  id: string;
  qrNumber: number;
  token: string;
  status: string;
}

export default function QRList({ qrs }: { qrs: QRData[] }) {
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
      <div className="mt-6 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar QR por número o token..."
          className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
        />
      </div>

      <div className="space-y-2">
        {search && filtered.length === 0 ? (
          <div className="text-sm text-slate-400 text-center p-4">
            Sin resultados
          </div>
        ) : (
          filtered.map((qr) => (
            <div
              key={qr.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 relative"
            >
              <Link
                href={`/qr/${qr.token}/view`}
                className="absolute top-3 right-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Ver
              </Link>
              <div className="font-medium text-slate-800">
                QR {qr.qrNumber.toString().padStart(4, "0")}
              </div>
              <div className="text-sm text-slate-500 font-mono">{qr.token}</div>
              <div className="text-xs mt-1 flex items-center gap-2">
                {qr.status === "ACTIVE" ? (
                  <>
                    <span className="text-green-600">● Activo</span>
                    <DeactivateButton token={qr.token} />
                  </>
                ) : (
                  <>
                    <span className="text-red-600">● Usado</span>
                    <ResetButton token={qr.token} />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}