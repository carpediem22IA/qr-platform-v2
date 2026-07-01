import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ControlCheckboxes from "./ControlCheckboxes";

// ========================================
// CONTROL DE PEGADO DIGITAL
// Checkboxes para marcar QR pegados
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ batchId: string }>;
};

export default async function ControlPage({ params }: Props) {
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      qrs: {
        orderBy: { qrNumber: "asc" },
        select: {
          id: true,
          qrNumber: true,
          token: true,
          status: true,
          peggedAt: true,
        },
      },
    },
  });

  if (!batch) notFound();

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <Link
        href={`/batches/${batch.id}/print`}
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Volver
      </Link>

      <h1 className="text-xl font-bold mt-4 mb-2 text-slate-800">
        Control de pegado
      </h1>
      <p className="text-sm text-slate-500 mb-2">
        Lote {batch.batchNumber} - {batch.name}
      </p>
      <p className="text-xs text-slate-400 mb-4">
        {batch.qrs.length} QR · {batch.qrSizeMm || 30}mm · {batch.qrs.filter(q => q.peggedAt).length} pegados
      </p>

      <ControlCheckboxes
        qrs={batch.qrs.map((qr) => ({
          id: qr.id,
          qrNumber: qr.qrNumber,
          token: qr.token,
          status: qr.status,
          peggedAt: qr.peggedAt?.toISOString() || null,
        }))}
      />
    </main>
  );
}