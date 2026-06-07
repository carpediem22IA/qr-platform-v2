// ========================================
// GENERADOR TOKEN QR SEGURO
// Evita colisiones en memoria (nivel app)
// ========================================

import { customAlphabet } from "nanoid";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const nanoid = customAlphabet(
  alphabet,
  6
);

// cache simple para evitar duplicados en el mismo batch
const usedTokens = new Set<string>();

export function generateUniqueToken() {
  let token = nanoid();

  while (usedTokens.has(token)) {
    token = nanoid();
  }

  usedTokens.add(token);

  return token;
}