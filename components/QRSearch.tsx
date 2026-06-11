"use client";

// ========================================
// BUSCADOR GLOBAL DE QR
// Busca por número o token
// ========================================

import { useState } from "react";
import Link from "next/link";

interface QRResult {
  qrNumber: number;
  token: string;
  status: string;
  batchNumber: number;
  batchName: string;
}

export default function QRSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<QRResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/qr/search?q=${encodeURIComponent(value)}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Número o token del QR..."
        className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm mb-4 text-sm"
      />

      {search.length >= 2 && (
        <div className="space-y-2">
          {loading ? (
            <div className="text-sm text-slate-400 text-center p-4">
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="text-sm text-slate-400 text-center p-4">
              Sin resultados
            </div>
          ) : (
            results.map((qr) => (
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
                    <div className="text-xs text-slate-400 mt-1">
                      Lote {qr.batchNumber} - {qr.batchName}
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