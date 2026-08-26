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
    return NextResponse.json({ url: setting?.value || "https://k9wezkettmqodlry.public.blob.vercel-storage.com/regalo.pdf" });
  } catch {
    return NextResponse.json({ url: "https://k9wezkettmqodlry.public.blob.vercel-storage.com/regalo.pdf" });
  }
}