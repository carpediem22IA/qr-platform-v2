// ========================================
// PÁGINA DE INICIO
// QR Platform V2
// ========================================

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">📱</div>
        <h1 className="text-2xl font-bold mb-2 text-slate-800">
          QR Platform V2
        </h1>
        <p className="text-slate-500 mb-6">
          Gestiona lotes de códigos QR, compártelos y valida su uso.
        </p>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-indigo-600 text-white px-6 py-3 font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          Ir al Dashboard
        </Link>
		<p></p>
		<Link
          href="/dashboard/admin"
          className="inline-block rounded-xl bg-red-600 text-white px-6 py-3 font-medium hover:bg-red-700 shadow-sm shadow-red-200 transition mt-3"
        >
          Admin
        </Link>
      </div>
    </main>
  );
}