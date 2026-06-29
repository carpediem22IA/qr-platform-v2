"use client";

// ========================================
// PANEL ADMIN MASTER
// Estadísticas + listado de lotes con acciones
// ========================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";

interface BatchData {
  id: string;
  batchNumber: number;
  name: string;
  printedAt: string | null;
  qrSizeMm: number;
  _count: { qrs: number };
  qrs: { status: string }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  // Cargar lotes
  useEffect(() => {
    fetch("/api/admin/batches")
      .then((r) => r.json())
      .then((data) => {
        setBatches(data);
        setLoading(false);
      });
  }, []);

  // Cargar estado de mantenimiento
  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then((r) => r.json())
      .then((d) => setMaintenance(d.maintenance));
  }, []);

  // Estadísticas
  const totalBatches = batches.length;
  const totalQR = batches.reduce((sum, b) => sum + b._count.qrs, 0);
  const activeQR = batches.reduce(
    (sum, b) => sum + b.qrs.filter((q) => q.status === "ACTIVE").length,
    0
  );
  const usedQR = totalQR - activeQR;

  const closeModal = () => setModal({ open: false, title: "", message: "", onConfirm: () => {} });

  // Resetear todo el lote
  const handleResetAll = (batchNumber: number) => {
    setModal({
      open: true,
      title: "Resetear lote",
      message: `¿Resetear todos los QR del lote ${batchNumber} a estado ACTIVO?`,
      confirmText: "✓ Resetear",
      onConfirm: async () => {
        closeModal();
        setActionLoading(`reset-${batchNumber}`);
        await fetch(`/api/admin/batch/${batchNumber}/reset-all`, { method: "POST" });
        setMessage(`✅ Lote ${batchNumber} reseteado`);
        setTimeout(() => window.location.reload(), 500);
      },
    });
  };

  // Desactivar todo el lote
  const handleDeactivateAll = (batchNumber: number) => {
    setModal({
      open: true,
      title: "Desactivar lote",
      message: `¿Desactivar todos los QR ACTIVOS del lote ${batchNumber}?`,
      confirmText: "✓ Desactivar",
      onConfirm: async () => {
        closeModal();
        setActionLoading(`deactivate-${batchNumber}`);
        await fetch(`/api/admin/batch/${batchNumber}/deactivate-all`, { method: "POST" });
        setMessage(`✅ Lote ${batchNumber} desactivado`);
        setTimeout(() => window.location.reload(), 500);
      },
    });
  };

  // Eliminar lote
  const handleDeleteBatch = (batchNumber: number) => {
    setModal({
      open: true,
      title: "Eliminar lote",
      message: `¿Eliminar el lote ${batchNumber} y TODOS sus QR? Esta acción no se puede deshacer.`,
      confirmText: "🗑 Eliminar",
      onConfirm: async () => {
        closeModal();
        setActionLoading(`delete-${batchNumber}`);
        await fetch(`/api/admin/batch/${batchNumber}`, { method: "DELETE" });
        setMessage(`✅ Lote ${batchNumber} eliminado`);
        setTimeout(() => window.location.reload(), 500);
      },
    });
  };
  
  // Vaciar backup
  const handleClearBackup = () => {
    setModal({
      open: true,
      title: "🗑️ Vaciar backup",
      message: "¿Eliminar todos los registros de la tabla de backup?",
      confirmText: "🗑 Vaciar backup",
      onConfirm: async () => {
        closeModal();
        await fetch("/api/admin/clear-backup", { method: "POST" });
        setMessage("✅ Tabla de backup vaciada");
        setTimeout(() => window.location.reload(), 500);
      },
    });
  };

  // Vaciar base de datos
  const handleResetAllData = () => {
    setModal({
      open: true,
      title: "⚠️ Vaciar base de datos",
      message: "¿Eliminar TODOS los lotes y QR? Esta acción NO SE PUEDE DESHACER.",
      confirmText: "⚠️ Vaciar todo",
      onConfirm: async () => {
        closeModal();
        await fetch("/api/admin/reset", { method: "POST" });
        setMessage("✅ Base de datos vaciada");
        setTimeout(() => window.location.reload(), 500);
      },
    });
  };
  
  // Toggle mantenimiento
  const handleToggleMaintenance = () => {
    const newValue = !maintenance;
    setModal({
      open: true,
      title: newValue ? "⚠️ Activar mantenimiento" : "✅ Desactivar mantenimiento",
      message: newValue
        ? "¿Activar el modo mantenimiento? Los clientes no podrán canjear QR."
        : "¿Desactivar el modo mantenimiento? Los clientes podrán volver a canjear QR.",
      confirmText: newValue ? "⚠️ Activar" : "✓ Desactivar",
      onConfirm: async () => {
        closeModal();
        setMaintenance(newValue);
        await fetch("/api/admin/maintenance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: newValue }),
        });
        setMessage(newValue ? "⚠️ Modo mantenimiento ACTIVADO" : "✅ Modo mantenimiento DESACTIVADO");
      },
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 max-w-md mx-auto">
        <div className="text-center text-slate-500 mt-20">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* CABECERA */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/dashboard"
          className="flex-1 text-sm rounded-xl bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 transition text-center"
        >
          Dashboard
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            await fetch("/api/auth/logout-master", { method: "POST" });
            router.push("/");
          }}
          className="flex-1 text-sm rounded-xl border border-red-200 text-red-500 px-4 py-2 font-medium hover:bg-red-50 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        🔒 Administración Maestra
      </h1>

      {message && (
        <div className="bg-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700">
          {message}
        </div>
      )}

      {/* MODO MANTENIMIENTO */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-800 text-sm">Modo mantenimiento</div>
            <div className="text-xs text-slate-500">Bloquea el canje de QR</div>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              maintenance
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {maintenance ? "⚠️ ACTIVO" : "Normal"}
          </button>
        </div>
      </div>

      {/* CONTENIDO DESCARGABLE */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-slate-800 text-sm">Contenido descargable</div>
            <div className="text-xs text-slate-500">Archivo que se descarga al canjear</div>
          </div>
          <Link
            href="/dashboard/admin/contenido"
            className="px-4 py-2 rounded-xl text-sm font-medium transition"
            style={{ backgroundColor: "#79449d", color: "white" }}
          >
            📦 Gestionar
          </Link>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600">{totalBatches}</div>
          <div className="text-sm text-slate-500 mt-1">Lotes</div>
        </div>
        <Link
          href="/dashboard/admin/qrs?filter=all"
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center hover:border-indigo-200 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-slate-800">{totalQR}</div>
          <div className="text-sm text-slate-500 mt-1">QR totales</div>
        </Link>
        <Link
          href="/dashboard/admin/qrs?filter=active"
          className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 text-center hover:border-green-200 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-green-600">{activeQR}</div>
          <div className="text-sm text-slate-500 mt-1">Activos</div>
        </Link>
        <Link
          href="/dashboard/admin/qrs?filter=used"
          className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center hover:border-red-200 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-red-600">{usedQR}</div>
          <div className="text-sm text-slate-500 mt-1">Usados</div>
        </Link>
      </div>

      {/* LISTADO DE LOTES */}
      <h2 className="font-semibold text-slate-700 mb-3 mt-6">Acciones por lote</h2>
      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-800">
                  Lote {batch.batchNumber}
                  {batch.printedAt && (
                    <span className="text-indigo-500 text-xs ml-1">✓ Impreso</span>
                  )}
                </div>
                <div className="text-sm text-slate-500">
                  {batch.name} · {batch._count.qrs} QR · {batch.qrSizeMm || 30}mm
                </div>
              </div>
              <Link
                href={`/dashboard/admin/lote/${batch.id}`}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Ver lote
              </Link>
            </div>

            <div className="flex gap-2">
              {batch.qrs.some((q) => q.status === "USED") && (
                <button
                  onClick={() => handleResetAll(batch.batchNumber)}
                  disabled={actionLoading === `reset-${batch.batchNumber}`}
                  className="flex-1 text-xs bg-amber-100 text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-200 disabled:opacity-50"
                >
                  {actionLoading === `reset-${batch.batchNumber}` ? "..." : "↺ Reset todo"}
                </button>
              )}
              {batch.qrs.some((q) => q.status === "ACTIVE") && (
                <button
                  onClick={() => handleDeactivateAll(batch.batchNumber)}
                  disabled={actionLoading === `deactivate-${batch.batchNumber}`}
                  className="flex-1 text-xs bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50"
                >
                  {actionLoading === `deactivate-${batch.batchNumber}` ? "..." : "✕ Desactivar todo"}
                </button>
              )}
              <button
                onClick={() => handleDeleteBatch(batch.batchNumber)}
                disabled={actionLoading === `delete-${batch.batchNumber}`}
                className="flex-1 text-xs bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === `delete-${batch.batchNumber}` ? "..." : "🗑 Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
	  
	  {/* VACIAR BACKUP */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-6 mt-6">
        <h2 className="font-semibold text-amber-600 mb-4">
          Backup de lotes
        </h2>

        <button
          onClick={handleClearBackup}
          className="w-full bg-amber-600 text-white p-4 rounded-xl font-medium hover:bg-amber-700"
        >
          🗑️ Vaciar tabla de backup
        </button>
      </div>

      {/* VACIAR TODO */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 mt-6">
        <h2 className="font-semibold text-red-600 mb-4">
          Zona peligrosa
        </h2>

        <button
          onClick={handleResetAllData}
          className="w-full bg-red-600 text-white p-4 rounded-xl font-medium hover:bg-red-700"
        >
          🗑️ Vaciar toda la base de datos
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
    </main>
  );
}