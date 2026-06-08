"use client";

// ========================================
// BOTÓN CANJEAR QR (CLIENTE)
// Llama a la API para marcar como USED
// ========================================

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  token: string;
}

export default function RedeemButton({ token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRedeem = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/qr/${token}/redeem`, {
        method: "POST",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error al canjear");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRedeem}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 text-white p-4 font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Canjeando..." : "✅ Canjear QR"}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}