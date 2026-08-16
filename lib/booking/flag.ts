/**
 * Booking feature flag.
 *
 * Three modes resolved from NEXT_PUBLIC_BOOKING_FLAG (public so the picker
 * component can branch isomorphically without a server round-trip):
 *
 *   - "off"                Legacy AppointmentForm. /api/booking/* routes
 *                          short-circuit with 404 so they're inert in prod.
 *   - "preview" (default)  Real picker only when ?booking=1 query param is
 *                          present. Lets staff QA in production without
 *                          flipping it on for everyone. NOTE: /api/booking/*
 *                          IS live in this mode — only "off" makes it inert.
 *   - "on"                 Real picker for all visitors.
 */

export type BookingMode = "off" | "preview" | "on";

export function getBookingMode(): BookingMode {
  const raw = (process.env.NEXT_PUBLIC_BOOKING_FLAG ?? "").trim().toLowerCase();
  if (raw === "on" || raw === "off") return raw;
  // Default is "preview": the legacy form stays the canonical /appointment
  // page (no visible regression), but ?booking=1 surfaces the new picker and
  // /api/booking/* responds. Flip to "on" once it's ready for everyone, or
  // "off" to fully disable.
  return "preview";
}

export function isBookingActiveForRequest(opts: {
  searchParams?: Record<string, string | string[] | undefined>;
}): boolean {
  const mode = getBookingMode();
  if (mode === "on") return true;
  if (mode === "off") return false;
  const param = opts.searchParams?.booking;
  const value = Array.isArray(param) ? param[0] : param;
  return value === "1" || value === "true";
}

/**
 * Server-side gate for /api/booking/* routes. We don't want public traffic
 * probing the routes when the flag is off — they return 404 so they look
 * identical to a non-existent endpoint.
 */
export function isBookingApiEnabled(): boolean {
  return getBookingMode() !== "off";
}
