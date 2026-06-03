import type {
  AvailabilityWindow,
  BookingProvider,
  BookingRequest,
  Reason,
  ReasonId,
  Slot,
} from "./types";
import {
  MAX_LOOKAHEAD_DAYS,
  MIN_LEAD_HOURS,
  PROVIDERS,
  REASONS,
  getProvider,
  getReason,
  practiceHoursOn,
} from "./rules";
import { makeId } from "./id";

/**
 * In-memory booking provider for development, preview, and QA.
 *
 * Generates a deterministic-feeling slot grid from the practice hours
 * defined in lib/site.ts and lib/booking/rules.ts. Confirms succeed
 * unconditionally and persist the booking to a process-local Map so
 * /cancel and /ics can echo back something reasonable.
 *
 * Two pieces of intentionally-fake behaviour:
 *   1. Slot ids are HMAC-free random tokens. The real NexHealth client
 *      returns a slot id that's a server-side reservation token; the
 *      confirm endpoint exchanges that token for an appointment.
 *   2. ~20% of generated slots are randomly marked "booked" so the UI
 *      has realistic gaps. The randomness is seeded from the date so
 *      successive availability calls in the same day are stable.
 */

type StoredBooking = {
  bookingId: string;
  startIso: string;
  endIso: string;
  providerName: string;
  reasonLabel: string;
  attemptId: string;
};

const bookings = new Map<string, StoredBooking>();
const attemptIdToBookingId = new Map<string, string>();

export function createMockClient(): BookingProvider {
  return {
    listReasons,
    listProviders,
    listAvailability,
    confirmBooking,
    cancelBooking,
  };
}

async function listReasons(): Promise<Reason[]> {
  return REASONS;
}

async function listProviders() {
  return PROVIDERS;
}

async function listAvailability(input: {
  reasonId: ReasonId;
  providerId?: string;
  window: AvailabilityWindow;
}): Promise<Slot[]> {
  const reason = getReason(input.reasonId);
  if (!reason) return [];
  const providers = input.providerId
    ? PROVIDERS.filter((p) => p.id === input.providerId)
    : PROVIDERS.filter((p) => p.acceptsReasons.includes(input.reasonId));

  const out: Slot[] = [];
  const start = parseLocalDate(input.window.startDate);
  const days = Math.min(input.window.days, MAX_LOOKAHEAD_DAYS);

  for (let i = 0; i < days; i += 1) {
    const day = addDays(start, i);
    const localDate = toLocalDate(day);
    const hours = practiceHoursOn(localDate);
    if (!hours) continue;

    for (const provider of providers) {
      let cursor = hours.openMin;
      while (cursor + reason.durationMinutes <= hours.closeMin) {
        const startIso = isoForLocal(localDate, cursor);
        const endIso = isoForLocal(localDate, cursor + reason.durationMinutes);

        if (
          !isPast(startIso, MIN_LEAD_HOURS) &&
          !pseudoRandomBooked(`${localDate}-${provider.id}-${cursor}`)
        ) {
          out.push({
            id: encodeSlotId({
              providerId: provider.id,
              reasonId: input.reasonId,
              startIso,
              endIso,
            }),
            startIso,
            endIso,
            providerId: provider.id,
            reasonId: input.reasonId,
          });
        }
        cursor += reason.durationMinutes;
      }
    }
  }

  return out;
}

async function confirmBooking(input: BookingRequest) {
  const decoded = decodeSlotId(input.slotId);
  if (!decoded) throw new BookingError("INVALID_SLOT", "That time slot expired. Please pick another.");
  if (decoded.reasonId !== input.reasonId)
    throw new BookingError("INVALID_SLOT", "Slot doesn't match the selected reason.");
  if (decoded.providerId !== input.providerId)
    throw new BookingError("INVALID_SLOT", "Slot doesn't match the selected provider.");

  // Dedupe on attempt id so an honest retry returns the same booking.
  const existing = attemptIdToBookingId.get(input.attemptId);
  if (existing) {
    const prior = bookings.get(existing);
    if (prior) return prior;
  }

  const reason = getReason(input.reasonId);
  const provider = getProvider(input.providerId);
  if (!reason || !provider) throw new BookingError("INVALID_SLOT", "Unknown reason or provider.");

  const bookingId = makeId();
  const stored: StoredBooking = {
    bookingId,
    startIso: decoded.startIso,
    endIso: decoded.endIso,
    providerName: provider.name,
    reasonLabel: reason.label,
    attemptId: input.attemptId,
  };
  bookings.set(bookingId, stored);
  attemptIdToBookingId.set(input.attemptId, bookingId);
  return stored;
}

async function cancelBooking(bookingId: string) {
  bookings.delete(bookingId);
}

export function lookupMockBooking(bookingId: string): StoredBooking | undefined {
  return bookings.get(bookingId);
}

// ---- helpers ----

export class BookingError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "BookingError";
  }
}

function parseLocalDate(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T12:00:00Z`);
}

function toLocalDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

/**
 * Treats the slot start as wall-clock time in America/Denver and appends
 * an explicit offset so downstream consumers (ICS, email, UI) don't have
 * to guess. We approximate the offset by the rough DST window — accurate
 * enough for the mock; the real NexHealth client returns properly-zoned
 * ISO strings from the upstream API.
 */
function isoForLocal(localDate: string, minuteOffset: number): string {
  const h = String(Math.floor(minuteOffset / 60)).padStart(2, "0");
  const m = String(minuteOffset % 60).padStart(2, "0");
  return `${localDate}T${h}:${m}:00${denverOffset(localDate)}`;
}

function denverOffset(localDate: string): string {
  // Rough DST window: 2nd Sunday of March → 1st Sunday of November.
  // Mock-only; production uses NexHealth's zoned strings.
  const [y, mo, d] = localDate.split("-").map(Number);
  const month = mo;
  if (month > 3 && month < 11) return "-06:00"; // MDT
  if (month < 3 || month > 11) return "-07:00"; // MST
  // Edge months: bias to MDT mid-spring and MST late-fall.
  if (month === 3) return d >= 8 ? "-06:00" : "-07:00";
  return d >= 1 && d <= 7 ? "-06:00" : "-07:00";
}

function isPast(iso: string, leadHours: number): boolean {
  return new Date(iso).getTime() < Date.now() + leadHours * 3600_000;
}

function pseudoRandomBooked(seed: string): boolean {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 5 === 0; // ~20% booked
}

function encodeSlotId(payload: {
  providerId: string;
  reasonId: ReasonId;
  startIso: string;
  endIso: string;
}): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeSlotId(slotId: string): {
  providerId: string;
  reasonId: ReasonId;
  startIso: string;
  endIso: string;
} | null {
  try {
    const json = Buffer.from(slotId, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (
      typeof parsed.providerId === "string" &&
      typeof parsed.reasonId === "string" &&
      typeof parsed.startIso === "string" &&
      typeof parsed.endIso === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
