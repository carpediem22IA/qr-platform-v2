"use client";

// ========================================
// BOTÓN DESACTIVAR QR
// Desactiva un QR manualmente
// ========================================

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  token: string;
}

export default function DeactivateButton({ token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDeactivate = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/qr/${token}/redeem`, {
        method: "POST",
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
      onClick={handleDeactivate}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded-full transition ${
        confirm
          ? "bg-amber-500 text-white"
          : "text-amber-600 hover:bg-amber-50"
      }`}
    >
      {loading ? "..." : confirm ? "¿Confirmar?" : "✕ Desactivar"}
    </button>
  );
}