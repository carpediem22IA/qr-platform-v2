import { NextResponse } from "next/server";

// ========================================
// API OBTENER URL DEL LOGO ACTUAL
// ========================================

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl) {
    return NextResponse.json({ url: "/logo.webp" });
  }

  // Listar archivos del bucket logos ordenados por fecha
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/list/logos`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json({ url: "/logo.webp" });
  }

  const data = await response.json();
  
  // Si hay archivos, usar el último
  if (data?.length > 0) {
    const lastFile = data[data.length - 1];
    const url = `${supabaseUrl}/storage/v1/object/public/logos/${lastFile.name}`;
    return NextResponse.json({ url });
  }

  return NextResponse.json({ url: "/logo.webp" });
}