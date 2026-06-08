import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";
import PrintButton from "./PrintButton";

// ========================================
// VISTA DE IMPRESIÓN DEL LOTE
// Muestra tarjetas QR con cantos redondeados
// listas para imprimir o guardar como PDF
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BatchPrintPage({ params }: Props) {
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
  // URL BASE PARA EL QR
  // ========================================

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <>
      {/* ======================================== */}
      {/* ESTILOS DE IMPRESIÓN */}
      {/* ======================================== */}

      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
            .no-print {
              display: none !important;
            }
            .qr-card {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>

      {/* ======================================== */}
      {/* CABECERA - NO SE IMPRIME */}
      {/* ======================================== */}

      <div className="no-print max-w-4xl mx-auto p-4 mb-6">
        <Link
          href={`/batches/${batch.id}`}
          className="text-sm underline"
        >
          ← Volver al lote
        </Link>

        <h1 className="text-2xl font-bold mt-4">
          Vista previa - Lote {batch.batchNumber}
        </h1>

        <p className="text-gray-600 mb-4">
          {batch.name} · {batch.qrs.length} QR
        </p>

        {/* BOTÓN IMPRIMIR */}
		
        <PrintButton />
		
      </div>

      {/* ======================================== */}
      {/* TARJETAS QR PARA IMPRIMIR */}
      {/* ======================================== */}

      <div className="max-w-4xl mx-auto p-4">
        {/* TÍTULO DEL LOTE - VISIBLE EN IMPRESIÓN */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            Lote {batch.batchNumber} - {batch.name}
          </h2>
          <p className="text-sm text-gray-500">
            {batch.qrs.length} QR ·{" "}
            {new Date(batch.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* CUADRÍCULA DE TARJETAS QR */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {batch.qrs.map((qr) => (
            <div
              key={qr.id}
              className="qr-card border-2 border-gray-200 rounded-2xl p-4 flex flex-col items-center bg-white"
            >
              {/* CÓDIGO QR */}
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG
                  value={`${baseUrl}/qr/${qr.token}`}
                  size={120}
                  level="M"
                  includeMargin={true}
                />
              </div>

              {/* NÚMERO DE QR */}
              <div className="mt-3 text-center">
                <div className="font-bold text-sm">
                  QR {qr.qrNumber.toString().padStart(4, "0")}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">
                  {qr.token}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}