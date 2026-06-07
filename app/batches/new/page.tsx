"use client";

// ========================================
// NUEVO LOTE
// Ruta: /batches/new
// ========================================

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBatchPage() {
  const router = useRouter();

  // ========================================
  // ESTADO FORMULARIO
  // ========================================

  const [name, setName] = useState("");

  const [quantity, setQuantity] = useState(10);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/batches",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
			quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      router.push("/dashboard");
    } catch {
      alert("Error al crear lote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* VOLVER */}

      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm underline"
        >
          ← Volver
        </Link>
      </div>

      {/* CABECERA */}

      <h1 className="text-2xl font-bold mb-6">
        Crear lote
      </h1>

      {/* FORMULARIO */}

      <form
		onSubmit={handleSubmit}
		className="space-y-4"
	  >
		{/* ========================================
			NOMBRE DEL LOTE
			======================================== */}

		<div>
		  <label className="block mb-2 text-sm font-medium">
			Nombre del lote
		  </label>

		  <input
           value={name}
		   onChange={(e) =>
			setName(e.target.value)
		   }
			type="text"
			placeholder="Ej: Junio 2026"
			className="w-full border rounded-lg p-3"
		  />
		</div>

		{/* ========================================
			CANTIDAD QR
			======================================== */}

		<div>
		  <label className="block mb-2 text-sm font-medium">
			Cantidad de QR
		  </label>

		  <input
			value={quantity}
			onChange={(e) =>
			  setQuantity(Number(e.target.value))
			}
			type="number"
			min="1"
			className="w-full border rounded-lg p-3"
		  />
		</div>

		{/* ========================================
			BOTÓN CREAR
			======================================== */}

		<button
		  type="submit"
		  disabled={loading}
		  className="w-full border rounded-lg p-4 font-medium"
		>
		 {loading
		   ? "Creando..."
		   : "Crear lote"}
		</button>
	  </form>
    </main>
  );
}