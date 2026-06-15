"use client";

// ========================================
// BOTÓN DESCARGAR PDF
// Genera PDF real con qrcode + jspdf
// Incluye logo superpuesto desde Supabase
// ========================================

import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface QRData {
  qrNumber: number;
  token: string;
}

interface Props {
  batchNumber: number;
  batchName: string;
  qrs: QRData[];
  baseUrl: string;
  qrSizeMm: number;
}

export default function DownloadPDFButton({
  batchNumber,
  batchName,
  qrs,
  baseUrl,
  qrSizeMm,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      // Obtener URL del logo desde la API
      let logoUrl = "/logo.webp";
      try {
        const res = await fetch("/api/admin/logo");
        if (res.ok) {
          const data = await res.json();
          logoUrl = data.url;
        }
      } catch {}

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const qrSize = qrSizeMm;
      const cardPadding = 4;
      const spacing = 8;
      const cardWidth = qrSize + cardPadding * 2;
      const cardHeight = qrSize + cardPadding * 2;

      const availableWidth = pageWidth - margin * 2;
      const cols = Math.max(1, Math.floor((availableWidth + spacing) / (cardWidth + spacing)));
      const totalCardsWidth = cardWidth * cols + spacing * (cols - 1);
      const startX = margin + (availableWidth - totalCardsWidth) / 2;

      let x = startX;
      let y = margin + 15;

      // Título
      const today = new Date().toLocaleDateString();
      const px = Math.round(qrSizeMm * 3.78);
      
      pdf.setFontSize(14);
      pdf.text(`Lote ${batchNumber} - ${batchName} - ${today}`, margin, margin + 5);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `${qrs.length} QR · ${qrSizeMm} mm · ${px} px`,
        margin,
        margin + 12
      );

      for (let i = 0; i < qrs.length; i++) {
        const qr = qrs[i];
        const url = `${baseUrl}/qr/${qr.token}`;

        const dataUrl = await QRCode.toDataURL(url, {
          width: qrSize * 3,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
          type: "image/jpeg",
        });

        const cardX = x;
        const cardY = y + 2;

        // Tarjeta
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, "S");

        // QR
        const qrX = cardX + cardPadding;
        const qrY = cardY + cardPadding;
        pdf.addImage(dataUrl, "JPEG", qrX, qrY, qrSize, qrSize);

        // Logo superpuesto en el centro del QR
        try {
          const logoResponse = await fetch(logoUrl);
          const logoBlob = await logoResponse.blob();
          const logoBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
          });

          const logoSize = qrSize * 0.2;
          const logoX = qrX + (qrSize - logoSize) / 2;
          const logoY = qrY + (qrSize - logoSize) / 2;
          pdf.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
        } catch {
          // Sin logo, no pasa nada
        }

        // Número QR
        pdf.setFontSize(8);
        pdf.setTextColor(30, 41, 59);
        const qrLabel = `QR ${String(qr.qrNumber).padStart(4, "0")}`;
        pdf.text(qrLabel, cardX + cardWidth / 2, cardY + cardHeight + 4, { align: "center" });

        // Token
        pdf.setFontSize(6);
        pdf.setTextColor(148, 163, 184);
        pdf.text(qr.token, cardX + cardWidth / 2, cardY + cardHeight + 10, { align: "center" });

        // Avanzar posición
        if ((i + 1) % cols === 0) {
          x = startX;
          y += cardHeight + spacing + 14;

          if (y + cardHeight + 14 > pageHeight - margin) {
            pdf.addPage();
            y = margin + 5;
          }
        } else {
          x += cardWidth + spacing;
        }
      }

      // Marca en cada página
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184);
        pdf.text("renovacionfemenina.org", pageWidth - margin, 5, {
          align: "right",
        });
      }

      pdf.save(`Lote-${batchNumber}-${batchName}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition disabled:opacity-50"
    >
      {loading ? "Generando..." : "📥 Descargar PDF"}
    </button>
  );
}