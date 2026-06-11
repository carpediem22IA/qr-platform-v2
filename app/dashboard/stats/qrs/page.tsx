import Link from "next/link";
import { prisma } from "@/lib/prisma";

// ========================================
// LISTADO DE QR FILTRADO
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function QRsPage({ searchParams }: Props) {
  const { filter } = await searchParams;

  const where =
    filter === "active"
      ? { status: "ACTIVE" as const }
      : filter === "used"
      ? { status: "USED" as const }
      : {};

  const qrs = await prisma.qR.findMany({
    where,
    include: { batch: true },
    orderBy: { qrNumber: "asc" },
  });

  const title =
    filter === "active"
      ? "QR Activos"
      : filter === "used"
      ? "QR Usados"
      : "Todos los QR";

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <Link href="/dashboard/stats" className="text-sm text-indigo-600 hover:text-indigo-700">
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2 text-slate-800">
        {title}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {qrs.length} QR encontrados
      </p>

      <div className="space-y-2">
        {qrs.map((qr) => (
          <Link
            key={qr.id}
            href={`/qr/${qr.token}/view`}
            className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-indigo-200 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">
                  QR {qr.qrNumber.toString().padStart(4, "0")}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {qr.token}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Lote {qr.batch.batchNumber} - {qr.batch.name}
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  qr.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {qr.status === "ACTIVE" ? "Activo" : "Usado"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}