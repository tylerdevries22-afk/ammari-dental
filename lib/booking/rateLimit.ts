/**
 * Token-bucket rate limiter, in-memory. Same lifetime caveat as idempotency.
 *
 * Default budget: 10 confirms per IP per hour. The picker takes 30+ seconds
 * to fill out, so a human will never hit the limit. Bots that probe the
 * endpoint hit it on attempt 11 and get a 429.
 */

type Bucket = { tokens: number; lastRefillMs: number };

const buckets = new Map<string, Bucket>();
const CAPACITY = 10;
const REFILL_INTERVAL_MS = 60 * 60 * 1000;

export function consumeToken(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefillMs: now };
    buckets.set(key, bucket);
  } else {
    // Refill proportionally instead of resetting the whole bucket at the
    // interval boundary. The wholesale reset allowed double the intended
    // budget: 10 confirms at T+59:59 and 10 more at T+60:01.
    const elapsed = now - bucket.lastRefillMs;
    const earned = Math.floor((elapsed / REFILL_INTERVAL_MS) * CAPACITY);
    if (earned > 0) {
      bucket.tokens = Math.min(CAPACITY, bucket.tokens + earned);
      // Advance only by the time actually consumed, so the sub-token
      // remainder carries forward instead of being discarded.
      bucket.lastRefillMs += Math.ceil((earned / CAPACITY) * REFILL_INTERVAL_MS);
    }
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // With gradual refill the caller waits for one token, not a full interval.
  const retryMs = bucket.lastRefillMs + REFILL_INTERVAL_MS / CAPACITY - now;
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil(retryMs / 1000)),
  };
}

/** Extracts a client identifier. Forwarded-for first, falls back to a tag. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
