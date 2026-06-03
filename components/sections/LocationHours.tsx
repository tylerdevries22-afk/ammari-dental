"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function LocationHours() {
  return (
    <section id="visit" data-chapter="Visit" className="py-24 lg:py-32 anchor-offset">
      <Container>
        <m.div
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="grid lg:grid-cols-2 gap-12"
        >
          <m.div variants={fadeUp}>
            <div className="eyebrow">Visit us</div>
            <h2 className="mt-3 text-4xl lg:text-5xl font-display tracking-tight">Location &amp; Hours</h2>

            <div className="mt-8 grid gap-6">
              <div className="flex gap-4">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-white border border-(--color-brand-100) text-(--color-brand-600) shrink-0">
                  <Icon name="anchor" className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-(--color-ink-900)">Our Location</div>
                  <div className="text-(--color-ink-700) text-sm">
                    {site.address.street}<br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-white border border-(--color-brand-100) text-(--color-brand-600) shrink-0">
                  <Icon name="phone" className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-(--color-ink-900)">Phone</div>
                  <a href={`tel:${site.phoneTel}`} className="text-(--color-ink-700) text-sm hover:text-(--color-brand-700)">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-white border border-(--color-brand-100) text-(--color-brand-600) shrink-0">
                  <Icon name="calendar" className="w-5 h-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-(--color-ink-900)">Hours of Operation</div>
                  <ul className="mt-2 grid gap-1 text-sm text-(--color-ink-700)">
                    {site.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-6 max-w-xs">
                        <span>{h.day}</span>
                        <span className="text-(--color-ink-500)">
                          {"closed" in h && h.closed
                            ? "Closed"
                            : `${"open" in h ? h.open : ""} – ${"close" in h ? h.close : ""}`}
                          {"note" in h && h.note ? ` ${h.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <Button href="/appointment">Book Appointment</Button>
              <Button href="/our-dental-office-location" variant="secondary">Get Directions</Button>
            </div>
          </m.div>

          <m.div variants={fadeUp} className="relative aspect-square lg:aspect-auto rounded-3xl overflow-hidden bg-(--color-brand-100) shadow-(--shadow-soft-lg)">
            <iframe
              loading="lazy"
              title="Ammari Dental Location"
              className="absolute inset-0 w-full h-full border-0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`)}&output=embed`}
            />
          </m.div>
        </m.div>
      </Container>
    </section>
  );
}
