"use client";

// ========================================
// BOTÓN RESETEAR QR
// Reactiva un QR usado
// ========================================

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  token: string;
}

export default function ResetButton({ token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleReset = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/qr/${token}/reset`, {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Error silencioso
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded-full transition ${
        confirm
          ? "bg-amber-500 text-white"
          : "text-amber-600 hover:bg-amber-50"
      }`}
    >
      {loading ? "..." : confirm ? "¿Confirmar?" : "↺ Reset"}
    </button>
  );
}