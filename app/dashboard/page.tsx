// ========================================
// DASHBOARD PRINCIPAL
// QR Platform V2
// ========================================

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">QR Platform V2</h1>

      <div className="mb-4">Total lotes: {batches.length}</div>

      <Link
        href="/batches/new"
        className="block w-full rounded-lg border p-4 font-medium mb-6 text-center"
      >
        Crear lote
      </Link>

      <section>
        <h2 className="font-semibold mb-3">Últimos lotes</h2>

        <div className="space-y-3">
          {batches.length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
              No hay lotes todavía
            </div>
          ) : (
            batches.map((batch) => (
              <Link
                key={batch.id}
                href={`/batches/${batch.id}`}
                className="block rounded-lg border p-4 hover:bg-gray-50"
              >
               <div className="font-semibold flex items-center gap-2">
                 Lote {batch.batchNumber}
                {batch.printedAt && (
                <span className="text-blue-600 text-sm">✓</span>
              )}
            </div>
               <div className="text-sm text-gray-600">{batch.name}</div>
               <div className="text-sm mt-2">{batch._count.qrs} QR</div>
              </Link>
            ))
          )}
        </div>
      </section>

      <div className="mt-8 flex gap-2">
        <button className="flex-1 rounded-lg border p-3">Compartir</button>
        <button className="flex-1 rounded-lg border p-3">Imprimir</button>
      </div>
    </main>
  );
}