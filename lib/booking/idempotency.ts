/**
 * Single-process idempotency cache. Survives the lifetime of one serverless
 * instance only — production wants Vercel KV, but for low-volume booking
 * (≪ 100 confirms/day) the worst case is a duplicate booking on cold start
 * within 10 min, which is the same protection the original mock form had.
 *
 * The cache stores the JSON response we returned, so a retry with the same
 * key gets the same confirmation payload (idempotent semantics).
 */

type Entry = { response: unknown; expiresAt: number };

const store = new Map<string, Entry>();
const TTL_MS = 10 * 60 * 1000;

function purge(now: number) {
  for (const [k, v] of store) {
    if (v.expiresAt <= now) store.delete(k);
  }
}

export function rememberIdempotent<T>(key: string, response: T): T {
  const now = Date.now();
  purge(now);
  store.set(key, { response, expiresAt: now + TTL_MS });
  return response;
}

export function recallIdempotent<T>(key: string): T | undefined {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }
  return entry.response as T;
}
