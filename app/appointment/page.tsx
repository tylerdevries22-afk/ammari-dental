import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { LocationHours } from "@/components/sections/LocationHours";
import { metaFor } from "@/lib/metadata";
import { BookOrRequest } from "@/components/booking/BookOrRequest";

export const metadata: Metadata = metaFor("/appointment");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Schedule a visit"
        title="Book an appointment"
        description="Pick a real opening on Dr. Ammari's schedule, or request a callback if your time isn't listed."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Appointment" }]}
      />
      <section className="pb-24">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <BookOrRequest defaultMode="book" />
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
