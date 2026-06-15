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
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">
            QR no encontrado
          </h1>
          <p className="text-slate-500">
            Este código no es válido.
          </p>

          <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-8 mb-6 mt-6 text-center">
            <img
              src="/producto.jpg"
              alt="Las once Triadas del Oráculo de las Diosas"
              className="max-w-[200px] mx-auto mb-2 rounded-xl"
            />
            <p className="text-sm mb-2" style={{ color: "#79449d" }}>by</p>
            <a
              href="https://renovacionfemenina.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: "#79449d" }}
            >
              renovacionfemenina.org
            </a>
          </div>

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
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">
            QR ya canjeado
          </h1>
          <p className="text-slate-500 mb-4">
            Este código ya fue utilizado.
          </p>

          <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-8 mb-6 text-center">
            <img
              src="/producto.jpg"
              alt="Las once Triadas del Oráculo de las Diosas"
              className="max-w-[200px] mx-auto mb-2 rounded-xl"
            />
            <p className="text-sm mb-2" style={{ color: "#79449d" }}>by</p>
            <a
              href="https://renovacionfemenina.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: "#79449d" }}
            >
              renovacionfemenina.org
            </a>
          </div>

          <p className="text-sm text-slate-400 mt-4">
            ¿Necesitas ayuda?{" "}
            <a
              href={`mailto:renovacionfemenina@gmail.com?subject=Problema con QR ${qr.qrNumber}&body=Token: ${qr.token}`}
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

        <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-8 mb-6 text-center">
            <img
              src="/producto.jpg"
              alt="Las once Triadas del Oráculo de las Diosas"
              className="max-w-[200px] mx-auto mb-2 rounded-xl"
            />
          <p className="text-sm mb-2" style={{ color: "#79449d" }}>by</p>
          <a
            href="https://renovacionfemenina.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
            style={{ color: "#79449d" }}
          >
            renovacionfemenina.org
          </a>
        </div>

        {/* BOTÓN CANJEAR */}
        <RedeemButton token={qr.token} />
		<p className="text-sm text-slate-400 mt-6">
          ¿Tienes dudas?{" "}
          <a
            href={`mailto:renovacionfemenina@gmail.com?subject=Consulta sobre QR ${qr.qrNumber}&body=Token: ${qr.token}`}
            className="text-indigo-600 underline"
          >
            Contactar soporte
          </a>
        </p>
      </div>
    </main>
  );
}