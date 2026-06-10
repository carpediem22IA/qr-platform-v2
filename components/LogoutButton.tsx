"use client";

// ========================================
// BOTÓN CERRAR SESIÓN
// ========================================

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-slate-400 hover:text-red-500 transition"
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}