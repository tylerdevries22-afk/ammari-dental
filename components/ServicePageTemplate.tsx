"use client";
import Image from "next/image";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RelatedServicesRail } from "@/components/sections/RelatedServicesRail";
import { CTABanner } from "@/components/sections/CTABanner";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
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

      {service.image && (
        <section className="pb-4 lg:pb-8">
          <Container>
            <m.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-(--radius-xl) overflow-hidden shadow-(--shadow-soft-lg)"
            >
              <Image
                src={service.image}
                alt={service.imageAlt ?? service.h1}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
                priority={false}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-(--color-brand-900)/40 via-transparent to-transparent pointer-events-none" />
            </m.div>
          </Container>
        </section>
      )}

      <section className="py-12 lg:py-20">
        <Container className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {service.transformation && (
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-16"
              >
                <div className="eyebrow mb-3 text-(--color-brand-600)">Real Result</div>
                <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-3 text-(--color-ink-900)">
                  Drag to see the transformation
                </h2>
                <p className="text-(--color-ink-700) leading-relaxed mb-6 max-w-2xl">
                  Editorial close-up of a representative before-and-after — drag the handle, tap the arrow keys, or let it auto-sweep to compare.
                </p>
                <BeforeAfterSlider
                  beforeSrc={service.transformation.beforeSrc}
                  afterSrc={service.transformation.afterSrc}
                  beforeAlt={service.transformation.beforeAlt}
                  afterAlt={service.transformation.afterAlt}
                  aspect="4 / 3"
                />
              </m.div>
            )}

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
