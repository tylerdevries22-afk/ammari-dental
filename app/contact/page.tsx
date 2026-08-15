import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { LocationHours } from "@/components/sections/LocationHours";
import { BookOrRequest } from "@/components/booking/BookOrRequest";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/contact");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        description="Book a visit live or send us a note — we'll follow up."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="pb-24">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-display tracking-tight mb-6">Schedule or reach out</h2>
            <BookOrRequest defaultMode="book" />
          </div>
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-(--color-brand-700) text-white p-8">
              <div className="text-xs uppercase tracking-widest text-(--color-brand-100) font-semibold">Phone</div>
              <a href="tel:+13032838009" className="block text-2xl font-display mt-1">(303) 283-8009</a>
              <div className="mt-4 text-xs uppercase tracking-widest text-(--color-brand-100) font-semibold">After-hours emergency</div>
              <a href="tel:+17204438178" className="block text-lg font-display mt-1">720-443-8178</a>
              <div className="mt-4 text-xs uppercase tracking-widest text-(--color-brand-100) font-semibold">Fax</div>
              <div className="text-sm mt-1">(303) 337-7809</div>
            </div>
            <div className="rounded-3xl bg-white border border-(--color-brand-100) p-8">
              <div className="text-xs uppercase tracking-widest text-(--color-brand-600) font-semibold">Address</div>
              <div className="mt-2 font-display text-lg leading-snug">
                1344 S Chambers Road, Suite 203<br />Aurora, CO 80017
              </div>
            </div>
          </aside>
        </Container>
      </section>
      <LocationHours />
    </>
  );
}
