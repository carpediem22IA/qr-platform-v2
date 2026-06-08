import { prisma } from "@/lib/prisma";
import RedeemButton from "./RedeemButton";

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
          <h1 className="text-2xl font-bold mb-2">QR no encontrado</h1>
          <p className="text-gray-600">
            Este código QR no existe en el sistema.
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
          <h1 className="text-2xl font-bold mb-2">QR ya canjeado</h1>
          <p className="text-gray-600 mb-4">
            Este código ya fue utilizado.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
            <p>Lote: {qr.batch.name}</p>
            <p>QR: {qr.qrNumber.toString().padStart(4, "0")}</p>
            {qr.redeemedAt && (
              <p>Canjeado: {new Date(qr.redeemedAt).toLocaleString()}</p>
            )}
          </div>
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
        <h1 className="text-2xl font-bold mb-2">QR Válido</h1>
        <p className="text-gray-600 mb-6">
          Este código está activo y listo para canjear.
        </p>

        <div className="bg-green-50 rounded-lg p-4 mb-6 text-sm">
          <p className="font-medium">Lote: {qr.batch.name}</p>
          <p>QR: {qr.qrNumber.toString().padStart(4, "0")}</p>
          <p>Token: {qr.token}</p>
        </div>
		{/* BOTÓN CANJEAR */}
        <RedeemButton token={qr.token} />
      </div>
    </main>
  );
}