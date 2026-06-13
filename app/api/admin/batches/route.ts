import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const batches = await prisma.batch.findMany({
    orderBy: { batchNumber: "asc" },
    include: {
      _count: { select: { qrs: true } },
      qrs: { select: { status: true } },
    },
  });

  return NextResponse.json(batches);
}