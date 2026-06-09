// ========================================
// DASHBOARD PRINCIPAL
// QR Platform V2
// ========================================

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

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

        <div className="space-y-3">
          {batches.length === 0 ? (
            <div className="rounded-xl bg-white border border-slate-100 p-4 text-sm text-slate-400 shadow-sm">
              No hay lotes todavía
            </div>
          ) : (
            batches.map((batch) => (
              <Link
                key={batch.id}
                href={`/batches/${batch.id}`}
                className="block rounded-xl bg-white border border-slate-100 p-4 hover:border-indigo-200 hover:shadow-md shadow-sm transition"
              >
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  Lote {batch.batchNumber}
                  {batch.printedAt && (
                    <span className="text-indigo-500 text-sm">✓</span>
                  )}
                </div>

                <div className="text-sm text-slate-500">
                  {batch.name}
                </div>

                <div className="text-sm mt-2 flex items-center gap-2 text-slate-500">
                  {batch._count.qrs} QR
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ACCIONES FUTURAS */}
      <div className="mt-8 flex gap-2">
        <Link
          href="/batches/print-all"
          className="flex-1 rounded-xl bg-indigo-600 text-white p-3 text-center font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          Imprimir
        </Link>
        <Link
          href="/dashboard/stats"
          className="flex-1 rounded-xl bg-emerald-600 text-white p-3 text-center font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition"
        >
          Estadísticas
        </Link>
      </div>
	  <div className="mt-8 text-center">
        <LogoutButton />
      </div>
    </main>
  );
}