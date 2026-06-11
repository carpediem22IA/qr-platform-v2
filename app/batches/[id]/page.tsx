import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ShareButton from "@/components/ShareButton";
import ResetButton from "@/components/ResetButton";
import DeactivateButton from "@/components/DeactivateButton";
import ScrollToBottom from "@/components/ScrollToBottom";

// ========================================
// DETALLE DE LOTE
// Muestra todos los QR de un lote
// con estadísticas de uso
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BatchPage({ params }: Props) {
  // ========================================
  // OBTENER ID DESDE LA URL
  // ========================================

  const { id } = await params;

  // ========================================
  // CONSULTAR LOTE Y SUS QR
  // ========================================

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      qrs: {
        orderBy: { qrNumber: "asc" },
      },
    },
  });

  // ========================================
  // LOTE NO ENCONTRADO
  // ========================================

  if (!batch) {
    return (
      <main className="p-4 text-center text-slate-500">
        Lote no encontrado
      </main>
    );
  }

  // ========================================
  // ESTADÍSTICAS DEL LOTE
  // ========================================

  const totalQR = batch.qrs.length;
  const usedQR = batch.qrs.filter((qr) => qr.status === "USED").length;
  const activeQR = totalQR - usedQR;

  return (
    <main className="max-w-md mx-auto p-4">
      {/* ======================================== */}
      {/* CABECERA + VOLVER */}
      {/* ======================================== */}

      <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700">
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold mt-4 text-slate-800">
        Lote {batch.batchNumber}
      </h1>

      <p className="text-slate-500">{batch.name}</p>

      {/* ======================================== */}
      {/* TARJETAS DE ESTADÍSTICAS */}
      {/* ======================================== */}

      <div className="grid grid-cols-2 gap-2 mt-4">
        {/* Total QR */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-slate-800">{totalQR}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>

        {/* QR Activos */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-green-600">{activeQR}</div>
          <div className="text-xs text-slate-500">Activos</div>
        </div>

        {/* QR Usados */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
          <div className="text-xl font-bold text-red-600">{usedQR}</div>
          <div className="text-xs text-slate-500">Usados</div>
        </div>

        {/* Estado de impresión */}
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

      {/* ======================================== */}
      {/* LISTADO DE QR DEL LOTE */}
      {/* ======================================== */}

      <div className="space-y-2 mt-6">
        {batch.qrs.map((qr) => (
          <div key={qr.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 relative">
		    <Link
              href={`/qr/${qr.token}/view`}
              className="absolute top-3 right-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              Ver
            </Link>
            {/* Número de QR */}
            <div className="font-medium text-slate-800">
              QR {qr.qrNumber}
            </div>

            {/* Token único */}
            <div className="text-sm text-slate-500 font-mono">
              {qr.token}
            </div>

            {/* Estado: ACTIVE o USED */}
            <div className="text-xs mt-1 flex items-center gap-2">
                            {qr.status === "ACTIVE" ? (
                <>
                  <span className="text-green-600">● Activo</span>
                  <DeactivateButton token={qr.token} />
                </>
              ) : (
                <>
                  <span className="text-red-600">● Usado</span>
                  <ResetButton token={qr.token} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================== */}
      {/* BOTONES DE ACCIÓN */}
      {/* ======================================== */}

      <div id="batch-actions" className="mt-8 flex gap-2">
        <ShareButton
          batchNumber={batch.batchNumber}
          batchName={batch.name}
          shareUrl={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/batches/${batch.id}/print?shared=1`}
        />
        <Link
          href={`/batches/${batch.id}/print`}
          className="flex-1 rounded-xl bg-indigo-600 text-white p-4 text-center font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          🖨️ Vista impresión
        </Link>
      </div>
	  <ScrollToBottom />
    </main>
  );
}