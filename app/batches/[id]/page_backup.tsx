import Link from "next/link";
import { prisma } from "@/lib/prisma";

// ========================================
// DETALLE DE LOTE
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BatchPage({
  params,
}: Props) {

  // ========================================
  // OBTENER ID
  // ========================================

  const { id } = await params;

  // ========================================
  // OBTENER LOTE
  // ========================================

  const batch = await prisma.batch.findUnique({
    where: {
      id,
    },

    include: {
      qrs: {
        orderBy: {
          qrNumber: "asc",
        },
      },
    },
  });

  if (!batch) {
    return (
      <main className="p-4">
        Lote no encontrado
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-4">

      {/* ======================================== */}
      {/* CABECERA */}
      {/* ======================================== */}

      <Link
        href="/dashboard"
        className="text-sm underline"
      >
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold mt-4">
        Lote {batch.batchNumber}
      </h1>

      <p className="text-gray-600">
        {batch.name}
      </p>

      <p className="mt-2 text-sm">
        Total QR: {batch.qrs.length}
      </p>

      {/* ======================================== */}
      {/* LISTADO QR */}
      {/* ======================================== */}

      <div className="space-y-3 mt-6">
        {batch.qrs.map((qr) => (
          <div
            key={qr.id}
            className="border rounded-lg p-4"
          >
            <div className="font-medium">
              QR {qr.qrNumber}
            </div>

            <div className="text-sm text-gray-600">
              {qr.token}
            </div>

            <div className="text-xs mt-1">
              {qr.status}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}