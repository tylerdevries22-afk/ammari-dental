import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed token used in cancel / .ics deep links.
 *
 * Format: <base64url(payload)>.<base64url(signature)>
 * Payload: { bookingId: string, exp: number /* unix seconds * / }
 *
 * The signing secret falls back to a deterministic-but-non-secret value when
 * BOOKING_SIGNING_SECRET is missing. That's fine for the mock-only mode the
 * feature ships in; once the real NexHealth flow is enabled the env var
 * MUST be set or every token can be forged.
 */

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

function secret(): string {
  const env = process.env.BOOKING_SIGNING_SECRET;
  if (env && env.length >= 16) return env;
  return "dev-only-booking-secret-not-for-production-use";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function fromB64url(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

export function mintCancelToken(
  bookingId: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ bookingId, exp });
  const payloadEncoded = b64url(payload);
  const sig = createHmac("sha256", secret()).update(payloadEncoded).digest();
  return `${payloadEncoded}.${b64url(sig)}`;
}

export function verifyCancelToken(
  token: string,
): { bookingId: string } | null {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [payloadEncoded, sigEncoded] = token.split(".");
  if (!payloadEncoded || !sigEncoded) return null;

  const expected = createHmac("sha256", secret())
    .update(payloadEncoded)
    .digest();
  const provided = fromB64url(sigEncoded);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  let payload: { bookingId?: unknown; exp?: unknown };
  try {
    payload = JSON.parse(fromB64url(payloadEncoded).toString("utf8"));
  } catch {
    return null;
  }
  if (typeof payload.bookingId !== "string") return null;
  if (typeof payload.exp !== "number") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return { bookingId: payload.bookingId };
}
