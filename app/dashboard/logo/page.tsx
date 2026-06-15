"use client";

// ========================================
// PÁGINA PARA CAMBIAR EL LOGO DE LOS QR
// Permite subir una imagen y previsualizarla
// ========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ========================================
  // PREVISUALIZAR IMAGEN SELECCIONADA
  // ========================================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  // ========================================
  // SUBIR LOGO A SUPABASE
  // ========================================

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Logo actualizado correctamente");
        setFile(null);
        setPreview(null);
        router.refresh();
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
      {/* CABECERA */}
      <Link
        href="/dashboard"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6 text-slate-800">
        🎨 Logo QR
      </h1>

      {/* MENSAJE */}
      {message && (
        <div className="bg-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* INSTRUCCIONES */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <p className="text-sm text-slate-600 mb-4">
          Selecciona una imagen para el centro de los QR. Formatos permitidos: PNG, JPG, WebP.
        </p>

        {/* INPUT DE ARCHIVO */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
		<p className="text-xs text-slate-400 mt-2 break-all">
          {file ? file.name : "Ningún archivo seleccionado"}
        </p>
      </div>

      {/* VISTA PREVIA */}
      {preview && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-center">
          <p className="text-sm text-slate-500 mb-4">Vista previa</p>
          <div className="bg-slate-100 rounded-xl inline-block p-4">
            <img
              src={preview}
              alt="Vista previa del logo"
              className="max-w-[120px] max-h-[120px] object-contain"
            />
          </div>
        </div>
      )}

      {/* BOTÓN SUBIR */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 text-white p-4 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
        >
          {loading ? "Subiendo..." : "📤 Subir logo"}
        </button>
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