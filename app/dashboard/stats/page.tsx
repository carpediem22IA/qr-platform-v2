import Link from "next/link";
import { prisma } from "@/lib/prisma";

// ========================================
// ESTADÍSTICAS GLOBALES
// Totales de lotes y QR
// ========================================

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  // ========================================
  // OBTENER ESTADÍSTICAS
  // ========================================

  const totalBatches = await prisma.batch.count();
  const totalQR = await prisma.qR.count();
  const activeQR = await prisma.qR.count({
    where: { status: "ACTIVE" },
  });
  const usedQR = await prisma.qR.count({
    where: { status: "USED" },
  });

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
        Estadísticas
      </h1>

      {/* TARJETAS 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {/* TOTAL LOTES */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {totalBatches}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Lotes
          </div>
        </div>

        {/* TOTAL QR */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-slate-800">
            {totalQR}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            QR totales
          </div>
        </div>

        {/* QR ACTIVOS */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {activeQR}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Activos
          </div>
        </div>

        {/* QR USADOS */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-red-600">
            {usedQR}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Usados
          </div>
        </div>
      </div>
    </main>
  );
}