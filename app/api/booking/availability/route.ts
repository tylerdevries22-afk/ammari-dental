import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingClient } from "@/lib/booking/client";
import { isBookingApiEnabled } from "@/lib/booking/flag";
import { MAX_LOOKAHEAD_DAYS } from "@/lib/booking/rules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  reasonId: z.string().min(1),
  providerId: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD"),
  days: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 14))
    .pipe(z.number().int().min(1).max(MAX_LOOKAHEAD_DAYS)),
});

export async function GET(req: Request) {
  if (!isBookingApiEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_QUERY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { reasonId, providerId, startDate, days } = parsed.data;
  const client = getBookingClient();
  const slots = await client.listAvailability({
    reasonId: reasonId as never,
    providerId,
    window: { startDate, days },
  });

  return NextResponse.json(
    { ok: true, slots },
    {
      headers: {
        // Short window so a confirm propagates quickly, long enough that a
        // fast-clicker doesn't slam NexHealth.
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    },
  );
}
