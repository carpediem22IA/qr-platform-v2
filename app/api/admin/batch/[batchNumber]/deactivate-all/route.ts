import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ batchNumber: string }> }
) {
  const { batchNumber } = await params;
  const num = Number(batchNumber);

  const batch = await prisma.batch.findUnique({ where: { batchNumber: num } });
  if (!batch) return NextResponse.json({ error: "Lote no encontrado" }, { status: 404 });

  await prisma.qR.updateMany({
    where: { batchId: batch.id, status: "ACTIVE" },
    data: { status: "USED", redeemedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}