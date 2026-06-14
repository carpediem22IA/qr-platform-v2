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
  const { id } = await params;
  const { shared } = await searchParams;
  const isShared = shared === "1";
  
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      qrs: {
        orderBy: { qrNumber: "asc" },
      },
    },
  });

  if (!batch) {
    return (
      <main className="p-4 text-center text-slate-500">
        Lote no encontrado
      </main>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <>
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
          @media (max-width: 640px) {
            .qr-card {
              transform: scale(0.8);
              transform-origin: top center;
            }
          }
        `}
      </style>

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

      <div className="w-full max-w-4xl mx-auto p-4 overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Lote {batch.batchNumber} - {batch.name} - {new Date(batch.createdAt).toLocaleDateString()}
          </h2>
          <p className="text-sm text-slate-500">
            {batch.qrs.length} QR · {batch.qrSizeMm || 30} mm · {Math.round((batch.qrSizeMm || 30) * 3.78)} px
          </p>
        </div>

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
              style={{ maxWidth: "100%" }}
            >
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