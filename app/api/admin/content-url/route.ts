import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API OBTENER URL DEL CONTENIDO ACTUAL
// Busca en Settings, si no hay usa URL de Vercel Blob
// ========================================

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "content_url" },
    });

    return NextResponse.json({ 
      url: setting?.value || "https://k9wezkettmqodlry.public.blob.vercel-storage.com/regalo.pdf" 
    });
  } catch (error) {
    console.error("Error obteniendo URL de contenido:", error);
    return NextResponse.json({ 
      url: "https://k9wezkettmqodlry.public.blob.vercel-storage.com/regalo.pdf" 
    });
  }
}