import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { LocationHours } from "@/components/sections/LocationHours";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/appointment");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Schedule a visit"
        title="Appointment"
        description="To request appointment availability, please fill out the form below. Our scheduling team will follow up to confirm."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Appointment" }]}
      />
      <section className="pb-24">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-display tracking-tight mb-2">Create an Appointment</h2>
            <p className="text-(--color-ink-700) mb-8">
              Fill out the form below and we&rsquo;ll be in touch shortly.
            </p>
            <AppointmentForm />
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-3xl bg-(--color-surface-muted) p-8">
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
