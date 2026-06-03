import { randomBytes } from "node:crypto";

/**
 * URL-safe random ID. 16 bytes ⇒ 128 bits of entropy ⇒ 22 base64url chars.
 * Used for booking IDs, idempotency keys, and slot identifiers.
 */
export function makeId(bytes = 16): string {
  return randomBytes(bytes).toString("base64url");
}
