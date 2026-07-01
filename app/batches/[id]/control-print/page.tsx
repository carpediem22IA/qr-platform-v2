import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ControlPrintPage({ params }: Props) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      qrs: {
        orderBy: { qrNumber: "asc" },
        select: { qrNumber: true, token: true },
      },
    },
  });

  if (!batch) notFound();

  return (
    <>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            @page {
              size: A4; margin: 10mm;
              @top-right {
                content: "renovacionfemenina.org";
                font-size: 10px; color: #94a3b8; font-family: Arial, sans-serif;
              }
            }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      <main className="max-w-4xl mx-auto p-4">
        <div className="no-print mb-4">
          <Link href={`/batches/${batch.id}/print`} className="text-sm text-indigo-600 hover:text-indigo-700">
            ← Volver
          </Link>
          <PrintButton />
        </div>

        <h1 className="text-xl font-bold mb-2 text-slate-800">
          Hoja de control - Lote {batch.batchNumber}
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          {batch.name} · {batch.qrs.length} QR
        </p>

        <div style={{ columnCount: 5, columnGap: "6mm", columnRule: "1px solid #cbd5e1" }}>
          {batch.qrs.map((qr) => (
            <div key={qr.qrNumber} style={{ breakInside: "avoid", marginBottom: "6mm", padding: "2mm 3mm" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2mm" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>
                  {qr.qrNumber.toString().padStart(4, "0")}
                </span>
                <span style={{ display: "inline-block", width: "6mm", height: "6mm", border: "2px solid #94a3b8", borderRadius: "3px", marginLeft: "4mm" }}></span>
              </div>
              <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>
                {qr.token}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}