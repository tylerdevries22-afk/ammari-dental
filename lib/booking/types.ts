/**
 * Shared types for the self-service booking flow.
 *
 * The booking system is provider-agnostic at the interface level: the client
 * abstraction (lib/booking/client.ts) selects either the real NexHealth REST
 * client or the in-memory mock based on environment variables, but every
 * caller depends only on these types.
 */

export type ReasonId =
  | "new-patient-exam"
  | "routine-cleaning"
  | "emergency"
  | "cosmetic-consult"
  | "implant-consult"
  | "second-opinion";

export type Reason = {
  id: ReasonId;
  label: string;
  description: string;
  durationMinutes: number;
  requiresNewPatient: boolean;
  /** NexHealth appointment-type IDs that match this reason. */
  appointmentTypeIds: number[];
  /** Show a warning that walk-in / phone is faster. */
  urgent?: boolean;
};

export type Provider = {
  id: string;
  name: string;
  role: string;
  /** Underlying NexHealth provider IDs that map to this display entry. */
  nexhealthProviderIds: number[];
  /** Reasons this provider accepts. */
  acceptsReasons: ReasonId[];
  bio?: string;
  photoUrl?: string;
};

export type Slot = {
  /** Opaque, server-signed identifier the client passes back at confirm time. */
  id: string;
  /** ISO-8601 in the practice timezone (America/Denver). */
  startIso: string;
  endIso: string;
  providerId: string;
  reasonId: ReasonId;
};

export type PatientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** ISO date YYYY-MM-DD. */
  dob: string;
  isNewPatient: boolean;
  insuranceCarrier?: string;
  notes?: string;
};

export type BookingRequest = {
  slotId: string;
  reasonId: ReasonId;
  providerId: string;
  patient: PatientInfo;
  /** Idempotency key minted client-side per attempt. */
  attemptId: string;
  /** HIPAA acknowledgement. */
  acknowledged: true;
  /** Honeypot — must be empty. */
  website?: string;
};

export type BookingConfirmation = {
  bookingId: string;
  startIso: string;
  endIso: string;
  providerName: string;
  reasonLabel: string;
  /** Signed token gating /cancel and /ics deep links. */
  manageToken: string;
};

export type AvailabilityWindow = {
  startDate: string; // YYYY-MM-DD inclusive
  days: number;
};

export interface BookingProvider {
  listReasons(): Promise<Reason[]>;
  listProviders(): Promise<Provider[]>;
  listAvailability(input: {
    reasonId: ReasonId;
    providerId?: string;
    window: AvailabilityWindow;
  }): Promise<Slot[]>;
  /**
   * Re-checks slot availability and books it atomically. The provider MAY
   * mutate the slot id between availability and confirm (e.g. NexHealth
   * returns a one-shot booking slot token), so the slot id passed in here is
   * trusted only after the provider re-validates it.
   */
  confirmBooking(input: BookingRequest): Promise<{
    bookingId: string;
    startIso: string;
    endIso: string;
    providerName: string;
    reasonLabel: string;
  }>;
  cancelBooking(bookingId: string): Promise<void>;
}

/** Tag used by Next's data cache to invalidate availability after a confirm. */
export const AVAILABILITY_CACHE_TAG = "booking-availability";
