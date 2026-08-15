import { z } from "zod";

/**
 * Single source of truth for the appointment request payload.
 *
 * Imported by BOTH the client form (components/sections/AppointmentForm.tsx)
 * and the API route (app/api/appointment/route.ts) so the two can never drift
 * apart again — a previous mismatch silently dropped `insurance` and `notes`
 * from every notification email.
 *
 * Max lengths are deliberate: they cap the size of the generated email and
 * bound the work done on an unauthenticated public endpoint.
 */
export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(32),
  email: z.string().trim().email("Please enter a valid email").max(254),
  preferredDate: z.string().trim().max(32).optional(),
  insurance: z.string().trim().max(80).optional(),
  reason: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(2000).optional(),
  hipaa: z.literal(true, { message: "Please acknowledge to continue" }),
  // Honeypot: must stay empty. Bots that fill it are accepted and dropped.
  website: z.string().max(0).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

/**
 * Row order for the notification email. Keeping this beside the schema means
 * adding a field to the form surfaces it in the email by default, instead of
 * being silently omitted.
 */
export const APPOINTMENT_EMAIL_ROWS = [
  ["Name", "name"],
  ["Email", "email"],
  ["Phone", "phone"],
  ["Preferred date", "preferredDate"],
  ["Insurance", "insurance"],
  ["Reason", "reason"],
  ["Notes", "notes"],
] as const satisfies ReadonlyArray<readonly [string, keyof AppointmentInput]>;
