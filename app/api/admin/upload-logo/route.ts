import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// API SUBIR LOGO A SUPABASE STORAGE
// Recibe una imagen y la guarda en el bucket "logos"
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
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp", "image/svg+xml", "image/tiff", "image/x-icon", "image/heic", "image/heif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa PNG, JPG o WebP" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Configuración de Supabase incompleta" },
        { status: 500 }
      );
    }

    // Subir a Supabase Storage
    const fileName = `logo-${Date.now()}.${file.type.split("/")[1]}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/logos/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": file.type,
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Error al subir la imagen" },
        { status: 500 }
      );
    }

    // URL pública del logo
    const logoUrl = `${supabaseUrl}/storage/v1/object/public/logos/${fileName}`;
	
	// Guardar URL en la base de datos
    await prisma.settings.upsert({
      where: { key: "logo_url" },
      update: { value: logoUrl },
      create: { key: "logo_url", value: logoUrl },
    });

    return NextResponse.json({ url: logoUrl });
  } catch (error) {
    console.error("Error al subir logo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}