import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LocationHours } from "@/components/sections/LocationHours";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/our-dental-office-location");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Find us"
        title="A Beautiful Practice For All Your Dental Needs"
        description="Conveniently located in Aurora, just off South Chambers Road, with easy parking and a calm, modern interior."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Office Location" }]}
      />
      <LocationHours />

      <section className="py-20">
        <Container className="max-w-4xl">
          <article className="prose prose-lg max-w-none [&_h2]:font-display [&_h2]:tracking-tight [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-[--color-ink-700] [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-[--color-ink-700] [&_a]:text-[--color-brand-700] [&_a]:underline">
            <h2>Our Facility</h2>
            <p>
              We&rsquo;ve designed our office to feel less like a clinic
              and more like a calm, professional space. Modern operatories,
              digital X-rays, intra-oral cameras, and quiet, comfortable
              treatment rooms make every visit easier — for first-time
              patients and longtime regulars alike.
            </p>

            <h2>Appointments</h2>
            <p>
              Appointments are available Monday through Friday, with
              extended hours to accommodate working schedules. We do our
              best to honor your time — please give us at least 24
              hours&rsquo; notice if you need to reschedule. If you have a
              dental emergency, call us right away and we&rsquo;ll work you
              in the same day whenever possible.
            </p>

            <h2>Insurance</h2>
            <p>
              We accept most major dental insurance plans and are in
              network with many of them. We&rsquo;ll verify your coverage
              before treatment and bill your insurance directly so you only
              owe your portion. See the full list on our{" "}
              <a href="/contact">contact page</a> or call us to confirm.
            </p>

            <h2>Financial Policy</h2>
            <p>
              Payment for the patient&rsquo;s portion is due at the time of
              service. We accept cash, check, and all major credit cards,
              and we offer CareCredit financing with several no-interest
              and low-interest plans. Estimates are provided in writing
              before treatment so you always know what to expect.
            </p>

            <h2>Cancellation Policy</h2>
            <p>
              We reserve treatment time specifically for you, so we ask for
              at least 24 hours&rsquo; notice if you need to cancel or
              reschedule. Repeated short-notice cancellations or no-shows
              may result in a small fee. We appreciate your understanding —
              it helps us keep openings available for patients in need.
            </p>
          </article>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
