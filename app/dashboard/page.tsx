// ========================================
// DASHBOARD PRINCIPAL
// QR Platform V2
// ========================================

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* CABECERA */}

      <h1 className="text-2xl font-bold mb-6">
        QR Platform V2
      </h1>

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

        <div className="rounded-lg border p-4 text-sm text-gray-500">
          No hay lotes todavía
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