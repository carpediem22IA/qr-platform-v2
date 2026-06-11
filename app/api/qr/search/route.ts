import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const isNumber = !isNaN(Number(q)) && q.trim() !== "";

  const qrs = await prisma.qR.findMany({
    where: isNumber
      ? { qrNumber: Number(q) }
      : { token: { contains: q } },
    include: { batch: true },
    take: 10,
    orderBy: { qrNumber: "asc" },
  });

  const results = qrs.map((qr) => ({
    qrNumber: qr.qrNumber,
    token: qr.token,
    status: qr.status,
    batchNumber: qr.batch.batchNumber,
    batchName: qr.batch.name,
  }));

  return NextResponse.json(results);
}