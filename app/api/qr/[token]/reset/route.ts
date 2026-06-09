import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API RESETEAR QR
// Cambia el estado de USED a ACTIVE
// ========================================

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const qr = await prisma.qR.findUnique({
    where: { token },
  });

  if (!qr) {
    return NextResponse.json(
      { error: "QR no encontrado" },
      { status: 404 }
    );
  }

  if (qr.status === "ACTIVE") {
    return NextResponse.json(
      { error: "QR ya está activo" },
      { status: 400 }
    );
  }

  await prisma.qR.update({
    where: { token },
    data: {
      status: "ACTIVE",
      redeemedAt: null,
    },
  });

  return NextResponse.json({ success: true });
}