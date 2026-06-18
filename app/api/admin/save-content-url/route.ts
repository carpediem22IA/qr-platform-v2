import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ========================================
// API GUARDAR URL DEL CONTENIDO
// ========================================

export async function POST(request: Request) {
  const { url } = await request.json();

  await prisma.settings.upsert({
    where: { key: "content_url" },
    update: { value: url },
    create: { key: "content_url", value: url },
  });

  return NextResponse.json({ success: true });
}