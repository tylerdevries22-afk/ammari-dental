/**
 * PII scrubber for log output.
 *
 * The booking flow handles names, emails, phone numbers, dates of birth, and
 * insurance carriers. Logs (console, Vercel runtime, error reporters) are
 * NOT a HIPAA-covered system, so any PII leaked there is a risk. This module
 * is the single chokepoint for converting a booking payload into a
 * loggable shape.
 */

const PII_KEYS = new Set([
  "firstName",
  "lastName",
  "name",
  "email",
  "phone",
  "dob",
  "dateOfBirth",
  "insuranceCarrier",
  "insurance",
  "notes",
  "message",
  "address",
]);

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export function scrubPII<T>(input: T): T {
  return walk(input as unknown as Json) as unknown as T;
}

function walk(v: Json): Json {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(walk);
  const out: { [k: string]: Json } = {};
  for (const [k, val] of Object.entries(v)) {
    if (PII_KEYS.has(k)) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = walk(val);
    }
  }
  return out;
}
