import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.batchBackup.deleteMany();
  return NextResponse.json({ success: true });
}