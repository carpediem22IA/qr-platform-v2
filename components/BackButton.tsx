"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="text-sm text-indigo-600 hover:text-indigo-700"
    >
      ← Volver
    </button>
  );
}