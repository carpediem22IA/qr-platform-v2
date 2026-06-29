import { prisma } from "@/lib/prisma";

// ========================================
// CREAR BACKUP DE UN LOTE
// Guarda todo el lote con sus QR en JSON
// ========================================

export async function createBackup(batchNumber: number, action: string) {
  const batch = await prisma.batch.findUnique({
    where: { batchNumber },
    include: {
      qrs: {
        orderBy: { qrNumber: "asc" },
      },
    },
  });

  if (!batch) return;

  const data = JSON.stringify({
    batch: {
      batchNumber: batch.batchNumber,
      name: batch.name,
      qrSizeMm: batch.qrSizeMm,
      printedAt: batch.printedAt,
      createdAt: batch.createdAt,
    },
    qrs: batch.qrs.map((qr) => ({
      qrNumber: qr.qrNumber,
      token: qr.token,
      status: qr.status,
      createdAt: qr.createdAt,
      redeemedAt: qr.redeemedAt,
    })),
  });

  await prisma.batchBackup.create({
    data: {
      batchNumber,
      data,
      action,
    },
  });
}