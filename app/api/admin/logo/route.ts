import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// API OBTENER URL DEL LOGO ACTUAL
// Busca en Settings, si no hay usa logo local
// ========================================

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "logo_url" },
    });

    return NextResponse.json({ 
      url: setting?.value || "/logo.webp" 
    });
  } catch (error) {
    console.error("Error obteniendo logo:", error);
    return NextResponse.json({ url: "/logo.webp" });
  }
}