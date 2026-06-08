"use client";

// ========================================
// BOTÓN COMPARTIR LOTE (CLIENTE)
// Usa Web Share API para compartir en
// WhatsApp, Telegram, Email, etc.
// ========================================

interface Props {
  batchNumber: number;
  batchName: string;
  shareUrl: string;
}

export default function ShareButton({ batchNumber, batchName, shareUrl }: Props) {
  const handleShare = async () => {
    // Si el navegador soporta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lote ${batchNumber} - ${batchName}`,
          text: `Aquí tienes el lote ${batchNumber}: ${batchName}`,
          url: shareUrl,
        });
      } catch {
        // Usuario canceló, no hacer nada
      }
    } else {
      // Fallback: copiar enlace al portapapeles
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Enlace copiado al portapapeles");
      } catch {
        alert("No se pudo compartir. URL: " + shareUrl);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex-1 rounded-lg border p-3 font-medium hover:bg-gray-50"
    >
      📤 Compartir
    </button>
  );
}