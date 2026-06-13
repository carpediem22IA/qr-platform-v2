import { NextResponse } from "next/server";
import { maintenanceMode, setMaintenanceMode } from "@/lib/maintenance";

export async function GET() {
  return NextResponse.json({ maintenance: maintenanceMode });
}

export async function POST(request: Request) {
  const { enabled } = await request.json();
  setMaintenanceMode(enabled);
  return NextResponse.json({ maintenance: maintenanceMode });
}