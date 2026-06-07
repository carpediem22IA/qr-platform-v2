// ========================================
// API - LOTES
// POST /api/batches
// ========================================

import { prisma } from "@/lib/prisma";

import { generateUniqueToken } from "@/lib/generateUniqueToken";


export async function POST(request: Request) {
  try {
    // ========================================
    // LEER DATOS
    // ========================================

    const body = await request.json();

    const name = body.name?.trim();
	
	// ========================================
	// LEER CANTIDAD
	// ========================================

	const quantity = Number(body.quantity);

    // ========================================
    // VALIDACIONES
    // ========================================

    if (!name) {
      return Response.json(
        { error: "Nombre requerido" },
        { status: 400 }
      );
    }
	
	if (!quantity || quantity < 1) {
	 return Response.json(
       { error: "Cantidad inválida" },
       { status: 400 }
     );
    }

    // ========================================
    // OBTENER SIGUIENTE NÚMERO DE LOTE
    // ========================================

    const lastBatch = await prisma.batch.findFirst({
      orderBy: {
        batchNumber: "desc",
      },
    });

    const nextBatchNumber = lastBatch
      ? lastBatch.batchNumber + 1
      : 1;

    // ========================================
    // CREAR LOTE
    // ========================================

    const batch = await prisma.batch.create({
      data: {
        name,
        batchNumber: nextBatchNumber,
      },
    });
	
	
	// ========================================
	// OBTENER ÚLTIMO QR
	// ========================================

	const lastQr = await prisma.qR.findFirst({
	  orderBy: {
      qrNumber: "desc",
    },
  });

	let nextQrNumber = lastQr?.qrNumber ?? 0;

	// ========================================
	// GENERAR QRs
	// ========================================

	const qrs = [];

	for (let i = 0; i < quantity; i++) {
		nextQrNumber++;

	qrs.push({
		qrNumber: nextQrNumber,
		token: generateUniqueToken(),
		batchId: batch.id,
    });
   }

	// ========================================
	// INSERT MASIVO
	// ========================================

	await prisma.qR.createMany({
	  data: qrs,
    });	
	

    return Response.json(batch);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}