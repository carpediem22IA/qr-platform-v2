import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API MARCAR LOTE COMO IMPRESO
// Actualiza printedAt con la fecha actual
// ========================================

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!batch) {
    return NextResponse.json(
      { error: "Lote no encontrado" },
      { status: 404 }
    );
  }

  // Actualizar printedAt
  await prisma.batch.update({
    where: { id },
    data: {
      printedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}