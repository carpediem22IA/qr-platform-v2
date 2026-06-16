import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API OBTENER URL DEL CONTENIDO ACTUAL
// ========================================

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "content_url" },
    });
    return NextResponse.json({ url: setting?.value || "/descarga.pdf" });
  } catch {
    return NextResponse.json({ url: "/descarga.pdf" });
  }
}