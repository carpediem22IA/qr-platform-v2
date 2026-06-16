import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// API SUBIR CONTENIDO DESCARGABLE
// Guarda el archivo en Supabase Storage
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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Configuración de Supabase incompleta" },
        { status: 500 }
      );
    }

    // Nombre fijo para sobrescribir siempre el mismo archivo
    const fileName = "contenido-descargable";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/descargas/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Error al subir" },
        { status: 500 }
      );
    }

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/descargas/${fileName}`;

    // Guardar URL en Settings
    await prisma.settings.upsert({
      where: { key: "content_url" },
      update: { value: fileUrl },
      create: { key: "content_url", value: fileUrl },
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error al subir contenido:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}