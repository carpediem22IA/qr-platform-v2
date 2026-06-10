import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.qR.deleteMany();
  await prisma.batch.deleteMany();
  return NextResponse.json({ success: true });
}