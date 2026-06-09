import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";
import PrintAllButton from "./PrintAllButton";

// ========================================
// IMPRESIÓN DE TODOS LOS QR
// Muestra todos los QR de todos los lotes
// ========================================

export const dynamic = "force-dynamic";

export default async function PrintAllPage() {
  // ========================================
  // OBTENER TODOS LOS QR CON SU LOTE
  // ========================================

  const qrs = await prisma.qR.findMany({
    orderBy: { qrNumber: "asc" },
    include: {
      batch: true,
    },
  });

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
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Volver al dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-4 text-slate-800">
          Vista previa - Todos los QR
        </h1>

        <p className="text-slate-500 mb-4">
          {qrs.length} QR totales
        </p>

        <PrintAllButton />
      </div>

      {/* ======================================== */}
      {/* TARJETAS QR PARA IMPRIMIR */}
      {/* ======================================== */}

      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Todos los QR
          </h2>
          <p className="text-sm text-slate-500">
            {qrs.length} QR · {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {qrs.map((qr) => (
            <div
              key={qr.id}
              className="qr-card border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center bg-white"
            >
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG
                  value={`${baseUrl}/qr/${qr.token}`}
                  size={Math.round(batch.qrSizeMm * 3.78)}
                  level="M"
                  includeMargin={true}
                />
              </div>

              <div className="mt-3 text-center">
                <div className="font-bold text-sm text-slate-800">
                  QR {qr.qrNumber.toString().padStart(4, "0")}
                </div>
                <div className="text-xs text-slate-400">
                  {qr.batch.name}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
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