import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { LocationHours } from "@/components/sections/LocationHours";
import { metaFor } from "@/lib/metadata";
import {
  getBookingMode,
  isBookingActiveForRequest,
} from "@/lib/booking/flag";

export const metadata: Metadata = metaFor("/appointment");

const AppointmentForm = dynamic(() =>
  import("@/components/sections/AppointmentForm").then((m) => m.AppointmentForm),
);
const BookingPicker = dynamic(() =>
  import("@/components/booking/BookingPicker").then((m) => m.BookingPicker),
);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const useRealBooking = isBookingActiveForRequest({ searchParams: sp });
  const mode = getBookingMode();
  const showPreviewHint = !useRealBooking && mode === "preview";

  return (
    <>
      <PageHero
        eyebrow="Schedule a visit"
        title={useRealBooking ? "Book an appointment" : "Appointment"}
        description={
          useRealBooking
            ? "Pick a real opening on Dr. Ammari's schedule. We'll confirm by email and text."
            : "To request appointment availability, please fill out the form below. Our scheduling team will follow up to confirm."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Appointment" }]}
      />
      <section className="pb-24">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {showPreviewHint && (
              <Link
                href="/appointment?booking=1"
                className="mb-6 group inline-flex items-center gap-2 rounded-(--radius-pill) bg-(--color-brand-50) text-(--color-brand-700) px-4 py-2 text-sm font-semibold border border-(--color-brand-100) hover:bg-(--color-brand-100) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden
                  className="grid place-items-center w-5 h-5 rounded-full bg-(--color-brand-600) text-(--color-brand-50) text-[10px] font-bold"
                >
                  New
                </span>
                Try booking in real time — pick a slot now
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            )}
            <h2 className="text-3xl font-display tracking-tight mb-2">
              {useRealBooking ? "Choose your visit" : "Create an Appointment"}
            </h2>
            <p className="text-(--color-ink-700) mb-8">
              {useRealBooking
                ? "Five quick steps. About a minute."
                : "Fill out the form below and we'll be in touch shortly."}
            </p>
            {useRealBooking ? <BookingPicker /> : <AppointmentForm />}
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-(--color-surface-muted) p-8 sticky top-28">
              <h3 className="font-display text-xl">Why patients choose Ammari Dental</h3>
              <ul className="mt-5 grid gap-3 text-sm text-(--color-ink-700)">
                <li>· 20+ years caring for Aurora families</li>
                <li>· Most major insurance accepted</li>
                <li>· Same-week openings available</li>
                <li>· Family-friendly, anxiety-aware care</li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>
      <LocationHours />
    </>
  );
}
