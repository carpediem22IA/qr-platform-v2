import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API LIMPIAR BACKUPS ANTIGUOS
// Solo borra backups de lotes que ya no existen
// ========================================

export async function POST() {
  const activeBatches = await prisma.batch.findMany({
    select: { batchNumber: true },
  });
  const activeNumbers = activeBatches.map((b) => b.batchNumber);

  let count = 0;

  if (activeNumbers.length > 0) {
    const result = await prisma.batchBackup.deleteMany({
      where: {
        batchNumber: { notIn: activeNumbers },
      },
    });
    count = result.count;
  } else {
    const result = await prisma.batchBackup.deleteMany();
    count = result.count;
  }

  return NextResponse.json({ success: true, count });
}