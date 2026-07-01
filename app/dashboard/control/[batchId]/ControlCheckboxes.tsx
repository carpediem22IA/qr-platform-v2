"use client";

// ========================================
// CHECKBOXES DE CONTROL DE PEGADO
// ========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScrollToBottom from "@/components/ScrollToBottom";

interface QRData {
  id: string;
  qrNumber: number;
  token: string;
  status: string;
  peggedAt: string | null;
}

interface Props {
  qrs: QRData[];
}

export default function ControlCheckboxes({ qrs }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(
    new Set(qrs.filter((qr) => qr.peggedAt).map((qr) => qr.id))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const allChecked = checked.size === qrs.length;
  const pegadosCount = checked.size;

  const toggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(qrs.map((qr) => qr.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setChecked(next);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const toPeg = qrs.filter((qr) => checked.has(qr.id) && !qr.peggedAt).map((q) => q.id);
      const toUnpeg = qrs.filter((qr) => !checked.has(qr.id) && qr.peggedAt).map((q) => q.id);

      const res = await fetch("/api/qr/peg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peg: toPeg, unpeg: toUnpeg }),
      });

      if (res.ok) {
        setMessage("✅ Cambios guardados");
        router.refresh();
      } else {
        setMessage("❌ Error al guardar");
      }
    } catch {
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={toggleAll}
          className="text-xs text-indigo-600 font-medium"
        >
          {allChecked ? "✕ Desmarcar todos" : "✓ Marcar todos como pegados"}
        </button>
        <div className="text-xs text-slate-400 mt-1">
          {pegadosCount}/{qrs.length} pegados
        </div>
      </div>

      <div className="space-y-1 mb-6">
        {qrs.map((qr) => (
          <label
            key={qr.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              qr.peggedAt ? "bg-green-50" : "bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(qr.id)}
              onChange={() => toggleOne(qr.id)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-700">
                QR {qr.qrNumber.toString().padStart(4, "0")}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {qr.token}
              </div>
            </div>
            {qr.peggedAt && (
              <span className="text-xs text-green-600">✓</span>
            )}
          </label>
        ))}
      </div>

      {message && (
        <div className="text-sm text-center mb-4 text-slate-600">{message}</div>
      )}

      <div id="save-actions">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 text-white p-4 font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition"
        >
          {loading ? "Guardando..." : "💾 Guardar cambios"}
        </button>
      </div>

      <ScrollToBottom targetId="save-actions" />
    </>
  );
}