"use client";

// ========================================
// BOTÓN DESCARGAR PDF
// Genera PDF real con qrcode + jspdf
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
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const qrSize = qrSizeMm;
      const cols = 2;
      const spacing = 8;
      const cardWidth = (pageWidth - margin * 2 - spacing) / cols;
      const cardHeight = qrSize + 20;

      let x = margin;
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

        // Generar QR como data URL
        const dataUrl = await QRCode.toDataURL(url, {
          width: qrSize * 3,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
		  type: "image/jpeg",
        });

        // Tarjeta
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "S");

        // QR centrado
        const qrX = x + (cardWidth - qrSize) / 2;
        const qrY = y + 4;
        pdf.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize);

        // Número QR
        pdf.setFontSize(9);
        pdf.setTextColor(30, 41, 59);
        const qrLabel = `QR ${String(qr.qrNumber).padStart(4, "0")}`;
        pdf.text(qrLabel, x + cardWidth / 2, qrY + qrSize + 8, {
          align: "center",
        });

        // Token
        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184);
        pdf.text(qr.token, x + cardWidth / 2, qrY + qrSize + 14, {
          align: "center",
        });

        // Avanzar posición
        if ((i + 1) % cols === 0) {
          x = margin;
          y += cardHeight + spacing;

          if (y + cardHeight > pageHeight - margin) {
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