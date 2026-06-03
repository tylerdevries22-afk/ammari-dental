import type { BookingProvider } from "./types";
import { createMockClient } from "./mockClient";
import { createNexHealthClient, isNexHealthConfigured } from "./nexhealth";

/**
 * Resolve the booking provider for the current request.
 *
 * Preference order:
 *   1. BOOKING_MOCK=1            — force mock (overrides everything, dev/QA)
 *   2. NEXHEALTH_* env present   — real NexHealth client
 *   3. fallback                  — mock
 *
 * The fallback path is intentional: it lets the picker work end-to-end in
 * preview deployments without leaking practice data, and means a misconfigured
 * env var degrades gracefully instead of 500-ing.
 */
let cached: BookingProvider | null = null;

export function getBookingClient(): BookingProvider {
  if (cached) return cached;
  if (process.env.BOOKING_MOCK === "1") {
    cached = createMockClient();
    return cached;
  }
  if (isNexHealthConfigured()) {
    cached = createNexHealthClient();
    return cached;
  }
  cached = createMockClient();
  return cached;
}

/** Test/dev hook: reset the cached client between fixtures. */
export function resetBookingClient(): void {
  cached = null;
}
