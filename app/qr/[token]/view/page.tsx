import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";
import BackButton from "@/components/BackButton";
import { getLogoUrl } from "@/lib/logo";

// ========================================
// VISTA DETALLE DE UN QR
// Imagen grande con toda su información
// ========================================

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function QRViewPage({ params }: Props) {
  const { token } = await params;

  const qr = await prisma.qR.findUnique({
    where: { token },
    include: { batch: true },
  });

  if (!qr) {
    return (
      <main className="p-4 text-center text-slate-500">
        QR no encontrado
      </main>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sizePx = Math.round((qr.batch.qrSizeMm || 30) * 3.78);
  
  const logoUrl = await getLogoUrl();

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
	
      <BackButton />

      <h1 className="text-xl font-bold mt-4 text-slate-800">
        QR {qr.qrNumber.toString().padStart(4, "0")}
      </h1>

      {/* IMAGEN QR GRANDE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mt-6 flex justify-center">
        <QRCodeSVG
          value={`${baseUrl}/qr/${qr.token}`}
          size={Math.min(sizePx * 2, 280)}
          level="M"
          includeMargin={true}
          className="max-w-full h-auto"
		  imageSettings={{
            src: logoUrl,
            height: Math.round(Math.min(sizePx * 2, 280) * 0.2),
            width: Math.round(Math.min(sizePx * 2, 280) * 0.2),
            excavate: true,
          }}
       />
      </div>

      {/* INFORMACIÓN */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Número QR</span>
          <span className="text-sm font-medium text-slate-800">
            {qr.qrNumber.toString().padStart(4, "0")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Token</span>
          <span className="text-sm font-mono text-slate-800">{qr.token}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Lote</span>
          <span className="text-sm text-slate-800">
            {qr.batch.batchNumber} - {qr.batch.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Tamaño</span>
          <span className="text-sm text-slate-800">
            {qr.batch.qrSizeMm || 30}mm · {sizePx}px
          </span>
        </div>
		<div className="flex justify-between">
          <span className="text-sm text-slate-500">Creado</span>
          <span className="text-sm text-slate-800">
            {new Date(qr.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
        {qr.batch.printedAt && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Impreso</span>
            <span className="text-sm text-slate-800">
              {new Date(qr.batch.printedAt).toLocaleDateString("es-ES")}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Estado</span>
          <span
            className={`text-sm font-medium ${
              qr.status === "ACTIVE" ? "text-green-600" : "text-red-600"
            }`}
          >
            {qr.status === "ACTIVE" ? "Activo" : "Usado"}
          </span>
        </div>
		{qr.redeemedAt && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Canjeado</span>
            <span className="text-sm text-slate-800">
              {new Date(qr.redeemedAt).toLocaleDateString("es-ES")} - {new Date(qr.redeemedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}
        
      </div>
    </main>
  );
}