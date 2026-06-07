/*import { PrismaClient } from "@prisma/client";

export async function GET() {
  return Response.json({
    ok: true,
    prismaClientType: typeof PrismaClient,
  });
}*/

//Volvemos a un código anterior

import { prisma } from "@/lib/prisma";

export async function GET() {
  const batches = await prisma.batch.count();

  return Response.json({
    ok: true,
    batches,
  });
}