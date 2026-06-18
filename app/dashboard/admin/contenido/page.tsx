"use client";

// ========================================
// PÁGINA PARA CAMBIAR EL CONTENIDO DESCARGABLE
// Subida directa a Supabase (hasta 50 MB)
// ========================================

import { useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

export default function ContenidoPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        setMessage("❌ El archivo es demasiado grande (máx. 50 MB)");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selected);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");

    try {
      // Subir directamente a Supabase Storage
      const { error } = await supabase.storage
        .from("descargas")
        .upload("contenido-descargable", file, {
          upsert: true,
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("descargas")
        .getPublicUrl("contenido-descargable");

      // Guardar URL en Settings via API
      await fetch("/api/admin/save-content-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlData.publicUrl }),
      });

      setMessage("✅ Contenido actualizado correctamente");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Error al subir"}`);
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

        <p className="text-xs text-amber-600 mb-3">
          ⚠️ Tamaño máximo: 50 MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
        <p className="text-xs text-slate-400 mt-2 break-all">
          {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : "Ningún archivo seleccionado"}
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