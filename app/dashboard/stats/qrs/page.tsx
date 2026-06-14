import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ScrollToBottom from "@/components/ScrollToBottom";
import BatchQRSearch from "@/components/BatchQRSearch";

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
        ← Volver a Estadísticas
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2 text-slate-800">
        {title}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {qrs.length} QR encontrados
      </p>

      <BatchQRSearch
        qrs={qrs.map((qr) => ({
          qrNumber: qr.qrNumber,
          token: qr.token,
          status: qr.status,
          batchId: qr.batchId,
        }))}
        batchId=""
      />
	  
	  <div id="qrs-actions" className="mt-8 text-center">
        <Link href="/dashboard/stats" className="text-sm text-indigo-600 hover:text-indigo-700">
          ← Volver a Estadísticas
        </Link>
      </div>

      <ScrollToBottom targetId="qrs-actions" />
    </main>
  );
}