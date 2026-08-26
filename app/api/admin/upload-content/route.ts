import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// ========================================
// API SUBIR CONTENIDO DESCARGABLE
// Guarda el archivo en Vercel Blob
// ========================================

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (50 MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande (máx. 50 MB)" },
        { status: 400 }
      );
    }

    // Nombre del archivo en Blob
    const extension = file.name.split(".").pop() || "pdf";
    const fileName = `contenido-descargable-${Date.now()}.${extension}`;

    // Subir a Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Guardar URL en Settings
    await prisma.settings.upsert({
      where: { key: "content_url" },
      update: { value: blob.url },
      create: { key: "content_url", value: blob.url },
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url 
    });
  } catch (error) {
    console.error("Error al subir contenido:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}