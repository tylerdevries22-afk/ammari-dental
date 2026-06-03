import { NextResponse } from "next/server";
import { isBookingApiEnabled } from "@/lib/booking/flag";
import { verifyCancelToken } from "@/lib/booking/cancelToken";
import { lookupMockBooking } from "@/lib/booking/mockClient";
import { buildIcs } from "@/lib/booking/ics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/booking/ics/<bookingId>/<token>
 *
 * Returns an .ics file for the booking. Token verifies the caller owns the
 * booking (it's the same HMAC manageToken from confirm). For the mock
 * client we look up the booking in-process; for the real NexHealth client
 * the deep link should embed the start/end so this endpoint doesn't need
 * to round-trip — wired up when NexHealth comes online.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; token: string }> },
) {
  if (!isBookingApiEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const { id, token } = await ctx.params;
  const claim = verifyCancelToken(token);
  if (!claim || claim.bookingId !== id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const booking = lookupMockBooking(id);
  if (!booking) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ics = buildIcs({
    bookingId: id,
    startIso: booking.startIso,
    endIso: booking.endIso,
    summary: `${booking.reasonLabel} with ${booking.providerName}`,
    description: "See your manage link for changes or cancellation.",
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="ammari-dental-${id}.ics"`,
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
