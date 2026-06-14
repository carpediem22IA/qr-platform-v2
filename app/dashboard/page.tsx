// ========================================
// DASHBOARD PRINCIPAL
// QR Platform V2
// ========================================

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import BatchSearch from "@/components/BatchSearch";
import ScrollToBottom from "@/components/ScrollToBottom";

export default async function DashboardPage() {
  const batches = await prisma.batch.findMany({
    orderBy: {
      batchNumber: "asc",
    },
    include: {
      _count: {
        select: {
          qrs: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 max-w-md mx-auto">
      {/* CABECERA */}
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        QR Platform
      </h1>
      <p className="text-slate-500 mb-6 text-sm">
        Gestiona tus lotes y códigos QR
      </p>

      {/* ESTADÍSTICA RÁPIDA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="text-3xl font-bold text-indigo-600">{batches.length}</div>
        <div className="text-sm text-slate-500">Lotes creados</div>
      </div>

      {/* ACCIÓN PRINCIPAL */}
      <Link
        href="/batches/new"
        className="block w-full rounded-xl bg-indigo-600 text-white p-4 font-medium mb-6 text-center hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
      >
        + Crear lote
      </Link>

      {/* LISTADO LOTES */}
      <section>
        <h2 className="font-semibold text-slate-700 mb-3">
          Últimos lotes
        </h2>

        <BatchSearch batches={batches as any} />
      </section>

      {/* ACCIONES FUTURAS */}
       <div id="dashboard-actions" className="mt-8 flex gap-2">
        <Link
          href="/dashboard/stats"
          className="flex-1 rounded-xl bg-emerald-600 text-white p-3 text-center font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition"
        >
          Estadísticas
        </Link>
        <button
          className="flex-1 rounded-xl bg-indigo-600 text-white p-3 text-center font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          Logo QR
        </button>
      </div>
	  <div className="mt-8 text-center">
        <LogoutButton />
      </div>
	  <ScrollToBottom targetId="dashboard-actions" />
    </main>
  );
}