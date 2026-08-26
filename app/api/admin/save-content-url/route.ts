import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API GUARDAR URL DEL CONTENIDO
// ========================================

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL no proporcionada" },
        { status: 400 }
      );
    }

    await prisma.settings.upsert({
      where: { key: "content_url" },
      update: { value: url },
      create: { key: "content_url", value: url },
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error guardando URL:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}