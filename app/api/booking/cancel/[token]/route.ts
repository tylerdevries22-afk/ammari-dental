import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBookingClient } from "@/lib/booking/client";
import { isBookingApiEnabled } from "@/lib/booking/flag";
import { verifyCancelToken } from "@/lib/booking/cancelToken";
import { AVAILABILITY_CACHE_TAG } from "@/lib/booking/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/booking/cancel/<token>
 *
 * Token is the HMAC-signed manageToken returned at confirm time. Verifies it
 * still validates (TTL, signature), then forwards a cancel to the booking
 * provider. No body required — token alone authorizes.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  if (!isBookingApiEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const { token } = await ctx.params;
  const claim = verifyCancelToken(token);
  if (!claim) {
    return NextResponse.json({ ok: false, error: "INVALID_TOKEN" }, { status: 401 });
  }

  const client = getBookingClient();
  await client.cancelBooking(claim.bookingId).catch(() => {
    // Idempotent: an already-cancelled booking still returns ok.
  });
  revalidateTag(AVAILABILITY_CACHE_TAG, "default");
  return NextResponse.json({ ok: true });
}
