import { prisma } from "@/lib/prisma";

// ========================================
// OBTENER URL DEL LOGO ACTUAL
// Busca en la tabla Settings, si no hay usa el logo local
// ========================================

export async function getLogoUrl(): Promise<string> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "logo_url" },
    });
    return setting?.value || "/logo.webp";
  } catch {
    return "/logo.webp";
  }
}