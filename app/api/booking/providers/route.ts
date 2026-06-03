import { NextResponse } from "next/server";
import { getBookingClient } from "@/lib/booking/client";
import { isBookingApiEnabled } from "@/lib/booking/flag";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isBookingApiEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const client = getBookingClient();
  const [reasons, providers] = await Promise.all([
    client.listReasons(),
    client.listProviders(),
  ]);
  return NextResponse.json({ ok: true, reasons, providers });
}
