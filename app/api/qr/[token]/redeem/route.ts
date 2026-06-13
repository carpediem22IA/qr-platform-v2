import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API CANJEAR QR
// Cambia el estado de ACTIVE a USED
// y guarda la fecha de canje
// ========================================

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  import { maintenanceMode } from "@/lib/maintenance";
  
  if (maintenanceMode) {
    return NextResponse.json(
      { error: "Sistema en mantenimiento. Intenta más tarde." },
      { status: 503 }
    );
  }

  // Buscar QR por token
  const qr = await prisma.qR.findUnique({
    where: { token },
  });

  if (!qr) {
    return NextResponse.json(
      { error: "QR no encontrado" },
      { status: 404 }
    );
  }

  if (qr.status === "USED") {
    return NextResponse.json(
      { error: "QR ya canjeado" },
      { status: 400 }
    );
  }

  // Marcar como USED
  await prisma.qR.update({
    where: { token },
    data: {
      status: "USED",
      redeemedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}