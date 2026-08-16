import { createHmac, timingSafeEqual } from "node:crypto";
import { isNexHealthConfigured } from "./nexhealth";

/**
 * Signed token used in cancel / .ics deep links.
 *
 * Format: <base64url(payload)>.<base64url(signature)>
 * Payload: { bookingId: string, exp: number /* unix seconds * / }
 *
 * The signing secret falls back to a committed, non-secret value so the mock
 * flow works in preview deployments. That fallback is only safe while no real
 * appointments exist: the literal is in the repo, so anyone could mint a valid
 * token for any bookingId and cancel another patient's appointment. It
 * therefore fails closed the moment the real NexHealth backend is active.
 */

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

const DEV_SECRET = "dev-only-booking-secret-not-for-production-use";

/** Mirrors getBookingClient()'s resolution without importing its module cache. */
function usingRealBookings(): boolean {
  if (process.env.BOOKING_MOCK === "1") return false;
  return isNexHealthConfigured();
}

function secret(): string {
  const env = process.env.BOOKING_SIGNING_SECRET;
  if (env && env.length >= 16) return env;
  if (usingRealBookings()) {
    throw new Error(
      "BOOKING_SIGNING_SECRET must be set (32+ chars) when the NexHealth booking " +
        "backend is configured. Without it every cancel/manage token is forgeable.",
    );
  }
  return DEV_SECRET;
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
