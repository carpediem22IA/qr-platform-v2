import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ResetButton from "@/components/ResetButton";
import DeactivateButton from "@/components/DeactivateButton";
import ScrollToBottom from "@/components/ScrollToBottom";
import QRList from "@/components/QRList";
import { getLogoUrl } from "@/lib/logo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminBatchPage({ params }: Props) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { qrs: { orderBy: { qrNumber: "asc" } } },
  });

  if (!batch) {
    return <main className="p-4 text-center text-slate-500">Lote no encontrado</main>;
  }

  const totalQR = batch.qrs.length;
  const usedQR = batch.qrs.filter((qr) => qr.status === "USED").length;
  const activeQR = totalQR - usedQR;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const logoUrl = await getLogoUrl();

  return (
    <main className="max-w-md mx-auto p-4">
      <Link href="/dashboard/admin" className="text-sm text-indigo-600 hover:text-indigo-700">
        ← Volver al panel
      </Link>

      <h1 className="text-2xl font-bold mt-4 text-slate-800">
        Lote {batch.batchNumber}
      </h1>
      <p className="text-slate-500">{batch.name}</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-slate-800">{totalQR}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-green-600">{activeQR}</div>
          <div className="text-xs text-slate-500">Activos</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-red-600">{usedQR}</div>
          <div className="text-xs text-slate-500">Usados</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          {batch.printedAt ? (
            <>
              <div className="text-xl font-bold text-indigo-500">✓</div>
              <div className="text-xs text-slate-500">Impreso</div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-slate-300">—</div>
              <div className="text-xs text-slate-500">Sin imprimir</div>
            </>
          )}
        </div>
      </div>

      <QRList
        qrs={batch.qrs.map((qr) => ({
          id: qr.id,
          qrNumber: qr.qrNumber,
          token: qr.token,
          status: qr.status,
        }))}
		baseUrl={baseUrl}
        logoUrl={logoUrl}
      />

      <div id="batch-actions" className="mt-8">
        <Link
          href="/dashboard/admin"
          className="block w-full rounded-xl bg-indigo-600 text-white p-4 text-center font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          ← Volver al panel
        </Link>
      </div>
      <ScrollToBottom targetId="batch-actions" />
    </main>
  );
}