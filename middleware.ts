import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ========================================
// MIDDLEWARE DE PROTECCIÓN
// Redirige a login si no hay sesión
// ========================================

// Rutas que requieren contraseña
const PROTECTED = ["/dashboard", "/batches/new", "/dashboard/stats"];

// Rutas de API protegidas
const PROTECTED_API = ["/api/batches"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger panel admin con contraseña maestra
  if (pathname.startsWith("/dashboard/admin")) {
    const masterSession = request.cookies.get("admin_master_session");
    if (masterSession?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    return NextResponse.next();
  }

  // Verificar si es ruta protegida
  const isProtected =
    PROTECTED.some((route) => pathname.startsWith(route)) ||
    PROTECTED_API.some((route) => pathname.startsWith(route)) ||
    pathname.match(/^\/batches\/[^/]+$/); // /batches/[id] pero no /batches/[id]/print

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verificar cookie de sesión
  const session = request.cookies.get("admin_session");

  if (session?.value !== "authenticated") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/batches/:path*",
    "/api/batches/:path*",
  ],
};