"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RelatedServicesRail } from "@/components/sections/RelatedServicesRail";
import { CTABanner } from "@/components/sections/CTABanner";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { site } from "@/lib/site";
import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  intro: string;
  benefits?: { title: string; body: string }[];
  process?: { title: string; body: string }[];
  faq?: { q: string; a: string }[];
};

export function ServicePageTemplate({ service, intro, benefits, process, faq }: Props) {
  return (
    <>
      <PageHero
        eyebrow={categoryLabel(service.category)}
        title={service.h1}
        description={intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/dental-services" },
          { label: service.name },
        ]}
        actions={
          <>
            <Button href="/appointment" iconEnd={<Icon name="arrow" className="w-4 h-4" />}>Book Appointment</Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" iconStart={<Icon name="phone" className="w-4 h-4" />}>
              {site.phone}
            </Button>
          </>
        }
      />

      <section className="py-12 lg:py-20">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {benefits && benefits.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-8 text-(--color-ink-900)">Why Patients Choose Us</h2>
                <m.ul
                  variants={stagger(0.06)}
                  initial={reveal.initial}
                  whileInView={reveal.whileInView}
                  viewport={reveal.viewport}
                  className="grid sm:grid-cols-2 gap-5"
                >
                  {benefits.map((b) => (
                    <m.li
                      key={b.title}
                      variants={fadeUp}
                      className="p-6 rounded-2xl bg-white border border-(--color-brand-100)"
                    >
                      <div className="grid place-items-center w-10 h-10 rounded-lg bg-(--color-brand-50) text-(--color-brand-600) mb-4">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      </div>
                      <div className="font-display text-lg">{b.title}</div>
                      <p className="mt-2 text-sm text-(--color-ink-700)">{b.body}</p>
                    </m.li>
                  ))}
                </m.ul>
              </div>
            )}

            {process && process.length > 0 && (
              <div className="mb-16">
                <ProcessTimeline steps={process} />
              </div>
            )}

            {faq && faq.length > 0 && (
              <FAQAccordion items={faq} />
            )}

            <RelatedServicesRail slug={service.slug} />
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 grid gap-5">
              <div className="rounded-2xl bg-(--color-brand-700) text-white p-6 shadow-(--shadow-soft-md)">
                <div className="text-xs uppercase tracking-widest text-(--color-brand-100) mb-2 font-semibold">Ready to start?</div>
                <div className="font-display text-2xl leading-tight">Book your visit</div>
                <p className="mt-2 text-sm text-(--color-brand-50)">
                  New and returning patients welcome.
                </p>
                <div className="mt-5 grid gap-2">
                  <Button href="/appointment" size="md" className="bg-white! text-(--color-brand-700)!">
                    Book Online
                  </Button>
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="block text-center py-2.5 rounded-full border border-white/30 hover:bg-white/10 text-sm font-semibold"
                  >
                    Call {site.phone}
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-(--color-brand-100) p-6">
                <div className="text-xs uppercase tracking-widest text-(--color-brand-600) font-semibold mb-3">Hours</div>
                <ul className="text-sm grid gap-1">
                  {site.hours.slice(0, 5).map((h) => (
                    <li key={h.day} className="flex justify-between text-(--color-ink-700)">
                      <span>{h.day}</span>
                      <span className="text-(--color-ink-500)">
                        {"closed" in h && h.closed
                          ? "Closed"
                          : `${"open" in h ? h.open : ""}–${"close" in h ? h.close : ""}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

function categoryLabel(c: Service["category"]) {
  return {
    general: "General Dentistry",
    cosmetic: "Cosmetic Dentistry",
    restorative: "Restorative Dentistry",
    surgical: "Surgical Dentistry",
    emergency: "Emergency Care",
  }[c];
}
