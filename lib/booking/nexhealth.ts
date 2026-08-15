import type {
  AvailabilityWindow,
  BookingProvider,
  BookingRequest,
  Reason,
  ReasonId,
  Slot,
} from "./types";
import { PROVIDERS, REASONS, getReason, getProvider } from "./rules";
import { BookingError } from "./mockClient";

/**
 * Real NexHealth REST client. Stubbed until the practice provisions an
 * account — fully typed and structured so the migration from mock ⇒ live
 * is a config change, not a code change.
 *
 * Auth: `Authorization: Bearer <NEXHEALTH_API_KEY>`
 * Base: `https://nexhealth.info/api`
 *
 * Endpoints used:
 *   GET  /providers
 *   GET  /appointment_types
 *   GET  /appointment_slots
 *   POST /patients
 *   POST /appointments
 */

type Env = {
  apiKey: string;
  subdomain: string;
  locationId: string;
};

function readEnv(): Env | null {
  const apiKey = process.env.NEXHEALTH_API_KEY;
  const subdomain = process.env.NEXHEALTH_SUBDOMAIN;
  const locationId = process.env.NEXHEALTH_LOCATION_ID;
  if (!apiKey || !subdomain || !locationId) return null;
  return { apiKey, subdomain, locationId };
}

export function isNexHealthConfigured(): boolean {
  return readEnv() !== null;
}

export function createNexHealthClient(): BookingProvider {
  const env = readEnv();
  if (!env) {
    throw new Error("NexHealth env vars missing; use createMockClient() instead");
  }
  return new NexHealthClient(env);
}

class NexHealthClient implements BookingProvider {
  private base = "https://nexhealth.info/api";
  constructor(private env: Env) {}

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const url = new URL(this.base + path);
    url.searchParams.set("subdomain", this.env.subdomain);
    url.searchParams.set("location_id", this.env.locationId);
    const res = await fetch(url.toString(), {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${this.env.apiKey}`,
        Accept: "application/vnd.Nexhealth+json;version=2",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new BookingError(
        `NEXHEALTH_${res.status}`,
        `NexHealth request failed: ${res.status} ${text.slice(0, 200)}`,
      );
    }
    return res.json() as Promise<T>;
  }

  async listReasons(): Promise<Reason[]> {
    // We keep our editorial reasons authoritative (durations, copy, urgency)
    // and only look up appointment-type IDs at confirm time.
    return REASONS;
  }

  async listProviders() {
    // Same editorial pattern: our PROVIDERS array is what the picker shows.
    // The NexHealth provider IDs are wired in via env-driven config in a
    // follow-up so we don't accidentally expose names that don't match
    // the marketing site.
    return PROVIDERS;
  }

  async listAvailability(input: {
    reasonId: ReasonId;
    providerId?: string;
    window: AvailabilityWindow;
  }): Promise<Slot[]> {
    const reason = getReason(input.reasonId);
    if (!reason) return [];
    const provider = input.providerId ? getProvider(input.providerId) : null;
    const pids = (provider?.nexhealthProviderIds ?? []).join(",");
    const atids = reason.appointmentTypeIds.join(",");

    const res = await this.req<NexHealthSlotsResponse>(
      `/appointment_slots?start_date=${input.window.startDate}&days=${input.window.days}` +
        (pids ? `&pids[]=${pids}` : "") +
        (atids ? `&appointment_type_ids[]=${atids}` : ""),
    );

    const out: Slot[] = [];
    for (const day of res.data ?? []) {
      for (const slot of day.slots ?? []) {
        out.push({
          id: slot.time, // NexHealth uses the ISO time as the booking handle
          startIso: slot.time,
          endIso: slot.end_time,
          providerId:
            PROVIDERS.find((p) => p.nexhealthProviderIds.includes(slot.provider_id))
              ?.id ?? "ammari",
          reasonId: input.reasonId,
        });
      }
    }
    return out;
  }

  async confirmBooking(input: BookingRequest) {
    const reason = getReason(input.reasonId);
    const provider = getProvider(input.providerId);
    if (!reason || !provider) throw new BookingError("INVALID_SLOT", "Unknown reason or provider.");

    const patient = await this.req<NexHealthPatientResponse>("/patients", {
      method: "POST",
      body: JSON.stringify({
        provider: { provider_id: provider.nexhealthProviderIds[0] },
        patient: {
          first_name: input.patient.firstName,
          last_name: input.patient.lastName,
          email: input.patient.email,
          bio: { phone_number: input.patient.phone, date_of_birth: input.patient.dob },
        },
      }),
    });

    const appointment = await this.req<NexHealthAppointmentResponse>("/appointments", {
      method: "POST",
      body: JSON.stringify({
        appt: {
          patient_id: patient.data.id,
          provider_id: provider.nexhealthProviderIds[0],
          appointment_type_id: reason.appointmentTypeIds[0],
          start_time: input.slotId, // we stored the ISO time as the slot id
          note: input.patient.notes ?? "",
        },
      }),
    });

    return {
      bookingId: String(appointment.data.id),
      startIso: appointment.data.start_time,
      endIso: appointment.data.end_time,
      providerName: provider.name,
      reasonLabel: reason.label,
    };
  }

  async cancelBooking(bookingId: string) {
    await this.req(`/appointments/${bookingId}/cancel`, { method: "PATCH" });
  }
}

type NexHealthSlotsResponse = {
  data?: Array<{
    slots?: Array<{ time: string; end_time: string; provider_id: number }>;
  }>;
};
type NexHealthPatientResponse = { data: { id: number } };
type NexHealthAppointmentResponse = {
  data: { id: number; start_time: string; end_time: string };
};
