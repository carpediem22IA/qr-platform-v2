"use client";

// ========================================
// INPUT PARA FILTRAR QR EN EL LISTADO
// ========================================

import { useState } from "react";

interface Props {
  onFilter: (search: string) => void;
}

export default function QRFilterInput({ onFilter }: Props) {
  const [search, setSearch] = useState("");

  const handleChange = (value: string) => {
    setSearch(value);
    onFilter(value);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Filtrar QR por número o token..."
      className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
    />
  );
}