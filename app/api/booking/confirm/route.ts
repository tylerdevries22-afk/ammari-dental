import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getBookingClient } from "@/lib/booking/client";
import { isBookingApiEnabled } from "@/lib/booking/flag";
import { rememberIdempotent, recallIdempotent } from "@/lib/booking/idempotency";
import { consumeToken, clientKey } from "@/lib/booking/rateLimit";
import { mintCancelToken } from "@/lib/booking/cancelToken";
import { sendBookingEmails } from "@/lib/booking/email";
import { scrubPII } from "@/lib/booking/sanitize";
import { site } from "@/lib/site";
import { AVAILABILITY_CACHE_TAG, type BookingConfirmation } from "@/lib/booking/types";
import { BookingError } from "@/lib/booking/mockClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  slotId: z.string().min(8),
  reasonId: z.string().min(1),
  providerId: z.string().min(1),
  attemptId: z.string().min(8),
  acknowledged: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
  patient: z.object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    email: z.email().max(120),
    phone: z.string().min(10).max(30),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    isNewPatient: z.boolean(),
    insuranceCarrier: z.string().max(80).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export async function POST(req: Request) {
  if (!isBookingApiEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const body = parsed.data;

  // Honeypot: silently accept and pretend, so bots don't learn what triggered.
  if (body.website) {
    const fake: BookingConfirmation = {
      bookingId: "ok",
      startIso: new Date().toISOString(),
      endIso: new Date().toISOString(),
      providerName: site.doctor,
      reasonLabel: "Visit",
      manageToken: "noop",
    };
    return NextResponse.json({ ok: true, confirmation: fake });
  }

  // Idempotency — honest retries return the original confirmation.
  const cached = recallIdempotent<BookingConfirmation>(body.attemptId);
  if (cached) {
    return NextResponse.json({ ok: true, confirmation: cached });
  }

  // Rate limit AFTER idempotency: a legit retry never burns a token.
  const ip = clientKey(req);
  const gate = consumeToken(`confirm:${ip}`);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }

  const client = getBookingClient();
  try {
    const result = await client.confirmBooking({
      slotId: body.slotId,
      reasonId: body.reasonId as never,
      providerId: body.providerId,
      attemptId: body.attemptId,
      acknowledged: true,
      patient: body.patient,
    });

    const manageToken = mintCancelToken(result.bookingId);
    const confirmation: BookingConfirmation = { ...result, manageToken };

    // Best-effort emails — never block the response.
    const origin = new URL(req.url).origin;
    void sendBookingEmails({
      bookingId: result.bookingId,
      startIso: result.startIso,
      endIso: result.endIso,
      providerName: result.providerName,
      reasonLabel: result.reasonLabel,
      patient: body.patient,
      manageUrl: `${origin}/appointment/manage/${manageToken}`,
      icsUrl: `${origin}/api/booking/ics/${result.bookingId}/${manageToken}`,
    });

    revalidateTag(AVAILABILITY_CACHE_TAG, "default");
    rememberIdempotent(body.attemptId, confirmation);

    return NextResponse.json({ ok: true, confirmation });
  } catch (err) {
    if (err instanceof BookingError) {
      console.warn("[booking] confirm rejected", err.code, scrubPII({ body }));
      return NextResponse.json(
        { ok: false, error: err.code, message: err.message },
        { status: 409 },
      );
    }
    console.error("[booking] confirm failed", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
