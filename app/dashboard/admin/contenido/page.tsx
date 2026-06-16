"use client";

// ========================================
// PÁGINA PARA CAMBIAR EL CONTENIDO DESCARGABLE
// ========================================

import { useRef, useState } from "react";
import Link from "next/link";

export default function ContenidoPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-content", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Contenido actualizado correctamente");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessage(`❌ ${data.error || "Error al subir"}`);
      }
    } catch {
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <Link
        href="/dashboard/admin"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Volver al panel
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6 text-slate-800">
        📦 Contenido descargable
      </h1>

      {message && (
        <div className="bg-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <p className="text-sm text-slate-600 mb-4">
          Sube el archivo que se descargará al canjear un QR (PDF, imagen, etc.)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
        <p className="text-xs text-slate-400 mt-2 break-all">
          {file ? file.name : "Ningún archivo seleccionado"}
        </p>
      </div>

      {file && (
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex-1 rounded-xl bg-indigo-600 text-white p-4 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
          >
            {loading ? "Subiendo..." : "📤 Subir contenido"}
          </button>
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            disabled={loading}
            className="rounded-xl border border-slate-200 text-slate-500 p-4 font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
        </div>
      )}
	  <style>
        {`
          input[type="file"] {
            color: transparent;
          }
        `}
      </style>
    </main>
  );
}