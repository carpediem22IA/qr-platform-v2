import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API LIMPIAR BACKUPS ANTIGUOS
// Solo borra backups de lotes que ya no existen
// ========================================

export async function POST() {
  // Obtener todos los números de lote activos
  const activeBatches = await prisma.batch.findMany({
    select: { batchNumber: true },
  });
  const activeNumbers = activeBatches.map((b) => b.batchNumber);

  // Borrar backups de lotes que ya no existen
  if (activeNumbers.length > 0) {
    await prisma.batchBackup.deleteMany({
      where: {
        batchNumber: { notIn: activeNumbers },
      },
    });
  } else {
    // Si no hay lotes activos, borrar todo
    await prisma.batchBackup.deleteMany();
  }

  return NextResponse.json({ success: true });
}