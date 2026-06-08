// ========================================
// DASHBOARD PRINCIPAL
// QR Platform V2
// ========================================

export const dynamic = "force-dynamic"; //Prueba error listado últimos lotes. Ahora se muestran todos los registros porque el dashboard debe mostrar datos actualizados constantemente.

import Link from "next/link";
import { prisma } from "@/lib/prisma";


// ========================================
// OBTENER LOTES
// ========================================

const batches = await prisma.batch.findMany({
  orderBy: {
    batchNumber: "asc",
  },

  include: {
    _count: {
      select: {
        qrs: true,
      },
    },
  },
});

//Prueba error listado DASHBOARD

console.log("TOTAL BATCHES:", batches.length);

console.log(
  batches.map((b) => ({
    batchNumber: b.batchNumber,
    name: b.name,
  }))
);

// ========================================
// ¿Cuántos lotes imprime el console.log?
// ========================================

console.log(
  "BATCHES:",
  batches.map((b) => ({
    batchNumber: b.batchNumber,
    name: b.name,
  }))
);

// ===================================================
// Tarda un tiempo en actualizarse el listado de lotes
// ===================================================

export default async function DashboardPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* CABECERA */}

      <h1 className="text-2xl font-bold mb-6">
        QR Platform V2
      </h1>
	  
	{/*Prueba error listado DASHBOARD*/}
	  
	<div className="mb-4">
     Total lotes: {batches.length}
    </div>

      {/* ACCIÓN PRINCIPAL */}

      <Link
        href="/batches/new"
        className="block w-full rounded-lg border p-4 font-medium mb-6 text-center"
      >
        Crear lote
      </Link>

      {/* LISTADO LOTES */}

      <section>
        <h2 className="font-semibold mb-3">
          Últimos lotes
        </h2>

{/* ======================================== */}
{/* LISTADO DE LOTES */}
{/* ======================================== */}

<div className="space-y-3">
  {batches.length === 0 ? (
    <div className="rounded-lg border p-4 text-sm text-gray-500">
      No hay lotes todavía
    </div>
  ) : (
    batches.map((batch) => (
    <Link
      key={batch.id}
	  href={`/batches/${batch.id}`}
	  className="block rounded-lg border p-4 hover:bg-gray-50"
	>
	<div className="font-semibold">
      Lote {batch.batchNumber}
    </div>

    <div className="text-sm text-gray-600">
      {batch.name}
    </div>

    <div className="text-sm mt-2">
      {batch._count.qrs} QR
    </div>
    </Link>
    ))
  )}
</div>
      </section>

      {/* ACCIONES FUTURAS */}

      <div className="mt-8 flex gap-2">
        <button className="flex-1 rounded-lg border p-3">
          Compartir
        </button>

        <button className="flex-1 rounded-lg border p-3">
          Imprimir
        </button>
      </div>
    </main>
  );
}