import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// ========================================
// API SUBIR LOGO A VERCEL BLOB
// Recibe una imagen y la guarda en el Blob
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

    // Validar tipo de imagen
    const allowedTypes = [
      "image/png", 
      "image/jpeg", 
      "image/webp", 
      "image/gif", 
      "image/bmp", 
      "image/svg+xml", 
      "image/tiff", 
      "image/x-icon", 
      "image/heic", 
      "image/heif"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa PNG, JPG o WebP" },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (4.5 MB)
    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande (máx. 4.5 MB)" },
        { status: 400 }
      );
    }

    // Subir a Vercel Blob
    const extension = file.type.split("/")[1] || "png";
    const fileName = `logo-${Date.now()}.${extension}`;
    
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Guardar URL en la base de datos
    await prisma.settings.upsert({
      where: { key: "logo_url" },
      update: { value: blob.url },
      create: { key: "logo_url", value: blob.url },
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url 
    });
  } catch (error) {
    console.error("Error al subir logo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}