import { prisma } from "@/lib/prisma";
import RedeemButton from "@/components/RedeemButton";

// ========================================
// PÁGINA PÚBLICA DE VALIDACIÓN QR
// Se accede al escanear el QR
// Muestra si está activo o ya usado
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function QRPage({ params }: Props) {
  // ========================================
  // OBTENER TOKEN DESDE LA URL
  // ========================================

  const { token } = await params;

  // ========================================
  // BUSCAR QR POR TOKEN
  // ========================================

  const qr = await prisma.qR.findUnique({
    where: { token },
    include: {
      batch: true,
    },
  });

  // ========================================
  // QR NO ENCONTRADO
  // ========================================

  if (!qr) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">❓</div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">
            QR no encontrado
          </h1>
          <p className="text-slate-500">
            Este código QR no existe en el sistema.
          </p>
		  <p className="text-sm text-slate-400 mt-4">
            ¿Necesitas ayuda?{" "}
            <a
              href="mailto:renovacionfemenina@gmail.com?subject=QR no encontrado"
              className="text-indigo-600 underline"
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // QR YA USADO
  // ========================================

  if (qr.status === "USED") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">
            QR ya canjeado
          </h1>
          <p className="text-slate-500 mb-4">
            Este código ya fue utilizado.
          </p>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-sm text-slate-500">
            <p>Lote: {qr.batch.name}</p>
            <p>QR: {qr.qrNumber.toString().padStart(4, "0")}</p>
            {qr.redeemedAt && (
              <p>Canjeado: {new Date(qr.redeemedAt).toLocaleString()}</p>
            )}
          </div>
		    <p className="text-sm text-slate-400 mt-4">
            ¿No pudiste descargar el contenido?{" "}
            <a
              href={`mailto:renovacionfemenina@gmail.com?subject=Problema con QR ya canjeado ${qr.qrNumber}&body=Token: ${qr.token}`}
              className="text-indigo-600 underline"
            >
              Solicitar soporte
            </a>
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // QR ACTIVO - LISTO PARA CANJEAR
  // ========================================

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2 text-slate-800">
          QR Válido
        </h1>
        <p className="text-slate-500 mb-6">
          Este código está activo y listo para canjear.
        </p>

        <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4 mb-6 text-sm">
          <p className="font-medium text-slate-800">
            Lote: {qr.batch.name}
          </p>
          <p className="text-slate-500">
            QR: {qr.qrNumber.toString().padStart(4, "0")}
          </p>
          <p className="text-slate-400 font-mono text-xs">
            {qr.token}
          </p>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          ¿Tienes dudas?{" "}
          <a
            href={`mailto:renovacionfemenina@gmail.com?subject=Consulta sobre QR ${qr.qrNumber}&body=Token: ${qr.token}`}
            className="text-indigo-600 underline"
          >
            Contactar soporte
          </a>
        </p>

        {/* BOTÓN CANJEAR */}
        <RedeemButton token={qr.token} />
      </div>
    </main>
  );
}