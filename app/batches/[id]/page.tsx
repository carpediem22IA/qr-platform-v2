import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
      <main className="p-4">
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

      <Link href="/dashboard" className="text-sm underline">
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold mt-4">
        Lote {batch.batchNumber}
      </h1>

      <p className="text-gray-600">{batch.name}</p>

      {/* ======================================== */}
      {/* TARJETAS DE ESTADÍSTICAS */}
      {/* ======================================== */}

      <div className="grid grid-cols-3 gap-2 mt-4">
        {/* Total QR */}
        <div className="border rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{totalQR}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>

        {/* QR Activos */}
        <div className="border rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{activeQR}</div>
          <div className="text-xs text-gray-500">Activos</div>
        </div>

        {/* QR Usados */}
        <div className="border rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-600">{usedQR}</div>
          <div className="text-xs text-gray-500">Usados</div>
        </div>
      </div>

      {/* ======================================== */}
      {/* LISTADO DE QR DEL LOTE */}
      {/* ======================================== */}

      <div className="space-y-3 mt-6">
        {batch.qrs.map((qr) => (
          <div key={qr.id} className="border rounded-lg p-4">
            {/* Número de QR */}
            <div className="font-medium">
              QR {qr.qrNumber}
            </div>

            {/* Token único */}
            <div className="text-sm text-gray-600">
              {qr.token}
            </div>

            {/* Estado: ACTIVE o USED */}
            <div className="text-xs mt-1">
              {qr.status === "ACTIVE" ? (
                <span className="text-green-600">● Activo</span>
              ) : (
                <span className="text-red-600">● Usado</span>
              )}
            </div>
          </div>
        ))}
      </div>
    {/* ======================================== */}
      {/* BOTÓN VISTA PREVIA E IMPRIMIR */}
      {/* ======================================== */}

      <div className="mt-8">
        <Link
          href={`/batches/${batch.id}/print`}
          className="block w-full rounded-lg bg-black text-white p-4 text-center font-medium hover:bg-gray-800"
        >
          🖨️ Vista previa e imprimir
        </Link>
      </div>
    </main>
  );
}