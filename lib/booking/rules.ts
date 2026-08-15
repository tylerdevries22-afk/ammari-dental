import { site } from "@/lib/site";
import type { Reason, ReasonId, Provider } from "./types";

/**
 * Booking business rules — single source of truth for what's bookable.
 *
 * These rules apply BEFORE the picker calls into the underlying provider
 * (NexHealth) so we can shape the experience without round-trips. The
 * provider re-validates anyway: if NexHealth says a slot is unavailable
 * the confirm endpoint surfaces that error verbatim.
 */

export const PRACTICE_TIMEZONE = "America/Denver";

/** Earliest lead time we'll surface — keeps front desk from being ambushed. */
export const MIN_LEAD_HOURS = 2;

/** Furthest out we'll let patients book. Same as most peers. */
export const MAX_LOOKAHEAD_DAYS = 30;

/**
 * Explicit closed-dates (US holidays + one-Friday-per-month). Update yearly.
 * Format: YYYY-MM-DD in the practice timezone.
 */
export const BLOCKED_DATES: ReadonlySet<string> = new Set([
  // 2026 federal holidays the practice observes
  "2026-01-01", // New Year's Day
  "2026-05-25", // Memorial Day
  "2026-07-03", // Independence Day (observed)
  "2026-07-04",
  "2026-09-07", // Labor Day
  "2026-11-26", // Thanksgiving
  "2026-11-27", // Day after
  "2026-12-24", // Christmas Eve
  "2026-12-25",
  "2026-12-31", // New Year's Eve
]);

export const REASONS: Reason[] = [
  {
    id: "new-patient-exam",
    label: "New patient exam & cleaning",
    description:
      "First visit. Includes a full exam, X-rays as needed, and a hygiene cleaning. Plan on 60 minutes.",
    durationMinutes: 60,
    requiresNewPatient: true,
    appointmentTypeIds: [],
  },
  {
    id: "routine-cleaning",
    label: "Routine cleaning",
    description:
      "Returning patient hygiene visit. 45 minutes with the hygienist.",
    durationMinutes: 45,
    requiresNewPatient: false,
    appointmentTypeIds: [],
  },
  {
    id: "emergency",
    label: "Tooth pain or emergency",
    description:
      "Same-week opening for active pain or a broken tooth. Call first for fastest scheduling.",
    durationMinutes: 30,
    requiresNewPatient: false,
    appointmentTypeIds: [],
    urgent: true,
  },
  {
    id: "cosmetic-consult",
    label: "Cosmetic consultation",
    description:
      "Talk through whitening, veneers, or smile design with the dentist. 30 minutes.",
    durationMinutes: 30,
    requiresNewPatient: false,
    appointmentTypeIds: [],
  },
  {
    id: "implant-consult",
    label: "Implant consultation",
    description:
      "Discuss replacing one or more teeth with implants. 45 minutes with imaging.",
    durationMinutes: 45,
    requiresNewPatient: false,
    appointmentTypeIds: [],
  },
  {
    id: "second-opinion",
    label: "Second opinion",
    description:
      "Bring an existing treatment plan and we'll review it with you. 30 minutes.",
    durationMinutes: 30,
    requiresNewPatient: false,
    appointmentTypeIds: [],
  },
];

export function getReason(id: ReasonId | string | undefined): Reason | null {
  if (!id) return null;
  return REASONS.find((r) => r.id === id) ?? null;
}

/**
 * Static provider directory used by the mock client. The real NexHealth
 * client overrides this from the API but uses the same `acceptsReasons`
 * shape to route the second step.
 */
export const PROVIDERS: Provider[] = [
  {
    id: "ammari",
    name: "Dr. Raed Ammari",
    role: "Founding Dentist",
    nexhealthProviderIds: [],
    acceptsReasons: [
      "new-patient-exam",
      "emergency",
      "cosmetic-consult",
      "implant-consult",
      "second-opinion",
    ],
    bio: "Practicing in Aurora since 2003. Conservative, comfortable care.",
    photoUrl: "/images/staff/dr-ammari.jpg",
  },
  {
    id: "hygiene",
    name: "Hygiene team",
    role: "Registered Dental Hygienists",
    nexhealthProviderIds: [],
    acceptsReasons: ["new-patient-exam", "routine-cleaning"],
    bio: "Cleanings, periodontal maintenance, and patient education.",
  },
];

export function getProvider(id: string | undefined): Provider | null {
  if (!id) return null;
  return PROVIDERS.find((p) => p.id === id) ?? null;
}

export function providersForReason(reasonId: ReasonId): Provider[] {
  return PROVIDERS.filter((p) => p.acceptsReasons.includes(reasonId));
}

/**
 * Returns true when the given local date (YYYY-MM-DD) is a working day per
 * the practice calendar. Used by both the mock slot generator and the
 * SlotGrid date carousel to render closed days as disabled.
 */
export function isOpenOn(localDate: string): boolean {
  if (BLOCKED_DATES.has(localDate)) return false;
  const dow = new Date(`${localDate}T12:00:00Z`).getUTCDay();
  // 0 Sun ... 6 Sat — practice hours: M–Th 08:30–17:00, F 10:00–15:00, Sat/Sun closed.
  if (dow === 0 || dow === 6) return false;
  return true;
}

export function practiceHoursOn(
  localDate: string,
): { openMin: number; closeMin: number } | null {
  if (!isOpenOn(localDate)) return null;
  const dow = new Date(`${localDate}T12:00:00Z`).getUTCDay();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dow];
  const entry = site.hours.find((h) => h.day === dayName);
  if (!entry || entry.closed || !entry.open || !entry.close) return null;
  return {
    openMin: toMinutes(entry.open),
    closeMin: toMinutes(entry.close),
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
