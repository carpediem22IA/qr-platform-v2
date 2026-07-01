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

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300">
              <th className="text-left py-2 text-sm text-slate-600 w-16">QR</th>
              <th className="text-left py-2 text-sm text-slate-600">Token</th>
              <th className="text-center py-2 text-sm text-slate-600 w-20">Pegado ✓</th>
            </tr>
          </thead>
          <tbody>
            {batch.qrs.map((qr) => (
              <tr key={qr.qrNumber} className="border-b border-slate-200">
                <td className="py-2 text-sm text-slate-800">
                  {qr.qrNumber.toString().padStart(4, "0")}
                </td>
                <td className="py-2 text-sm text-slate-500 font-mono">{qr.token}</td>
                <td className="py-2 text-center">
                  <span className="inline-block w-6 h-6 border-2 border-slate-300 rounded"></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}