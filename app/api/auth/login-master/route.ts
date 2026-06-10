import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const masterPassword = process.env.ADMIN_MASTER_PASSWORD;

  if (!masterPassword) {
    return NextResponse.json({ error: "Servidor no configurado" }, { status: 500 });
  }

  if (password !== masterPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_master_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  return response;
}