import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";
import PrintButton from "@/components/PrintButton";
import DownloadPDFButton from "@/components/DownloadPDFButton";

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
  searchParams: Promise<{
    shared?: string;
  }>;
};

export default async function BatchPrintPage({ params, searchParams }: Props) {
  // ========================================
  // OBTENER ID Y PARÁMETROS
  // ========================================

  const { id } = await params;
  const { shared } = await searchParams;
  const isShared = shared === "1";
  
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
              @top-right {
                content: "renovacionfemenina.org";
                font-size: 10px;
                color: #94a3b8;
                font-family: Arial, Helvetica, sans-serif;
              }
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
        {!isShared && (
          <Link
            href={`/batches/${batch.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Volver al lote
          </Link>
        )}

        <h1 className="text-2xl font-bold mt-4 text-slate-800">
          Lote {batch.batchNumber} - {batch.name}
        </h1>

        <p className="text-slate-500 mb-4">
          {batch.qrs.length} QR · {batch.qrSizeMm || 30} mm · {Math.round((batch.qrSizeMm || 30) * 3.78)} px
        </p>

        {/* BOTÓN IMPRIMIR */}
        <div className="flex gap-2">
          <PrintButton batchId={batch.id} />
          <DownloadPDFButton
            batchNumber={batch.batchNumber}
            batchName={batch.name}
            qrs={batch.qrs.map((qr) => ({
              qrNumber: qr.qrNumber,
              token: qr.token,
            }))}
            baseUrl={baseUrl}
            qrSizeMm={batch.qrSizeMm || 30}
          />
        </div>
      </div>

      {/* ======================================== */}
      {/* TARJETAS QR PARA IMPRIMIR */}
      {/* ======================================== */}

      <div className="w-full max-w-4xl mx-auto p-4">
        {/* TÍTULO DEL LOTE - VISIBLE EN IMPRESIÓN */}
        <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
            Lote {batch.batchNumber} - {batch.name} - {new Date(batch.createdAt).toLocaleDateString()}
          </h2>
          <p className="text-sm text-slate-500">
            {batch.qrs.length} QR · {batch.qrSizeMm || 30} mm · {Math.round((batch.qrSizeMm || 30) * 3.78)} px
          </p>
        </div>

        {/* CUADRÍCULA DE TARJETAS QR */}
        <div 
          className="grid gap-4"
          style={{
			width: "100%",
            gridTemplateColumns: `repeat(auto-fill, minmax(${Math.round((batch.qrSizeMm || 30) * 3.78) + 40}px, 1fr))`,
            justifyContent: "center",
          }}
        >
          {batch.qrs.map((qr) => (
            <div
              key={qr.id}
              className="qr-card flex flex-col items-center"
            >
              {/* TARJETA SOLO CON QR */}
              <div className="border-2 border-slate-200 rounded-2xl p-4 bg-white">
                <QRCodeSVG
                  value={`${baseUrl}/qr/${qr.token}`}
                  size={Math.round(batch.qrSizeMm * 3.78)}
                  level="M"
                  includeMargin={false}
                  imageSettings={{
                    src: "/logo.webp",
                    height: Math.round(batch.qrSizeMm * 3.78) * 0.2,
                    width: Math.round(batch.qrSizeMm * 3.78) * 0.2,
                    excavate: true,
                  }}
                />
              </div>

              {/* DATOS FUERA DE LA TARJETA */}
              <div className="mt-2 text-center">
                <div className="font-bold text-xs text-slate-700">
                  QR {qr.qrNumber.toString().padStart(4, "0")}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
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