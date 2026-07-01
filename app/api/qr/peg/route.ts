import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API MARCAR/DESMARCAR QR COMO PEGADOS
// ========================================

export async function POST(request: Request) {
  const { peg, unpeg } = await request.json();

  if (peg?.length > 0) {
    await prisma.qR.updateMany({
      where: { id: { in: peg } },
      data: { peggedAt: new Date() },
    });
  }

  if (unpeg?.length > 0) {
    await prisma.qR.updateMany({
      where: { id: { in: unpeg } },
      data: { peggedAt: null },
    });
  }

  return NextResponse.json({ success: true });
}