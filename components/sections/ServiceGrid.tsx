"use client";
import { useRef } from "react";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceTile } from "@/components/sections/ServiceTile";
import { ServiceIconDefs } from "@/components/illustrations/scenes";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, reveal } from "@/lib/motion";
import { services, servicesByCategory } from "@/lib/services";

export function ServiceGrid({
  heading = "Featured Services",
  eyebrow = "What we do",
  description = "Comprehensive dentistry under one roof — from routine care to full-mouth restoration.",
  showAll = false,
}: {
  heading?: string;
  eyebrow?: string;
  description?: string;
  showAll?: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  // When showing the full menu, order the cards by category so the carousel
  // reads General → Cosmetic → Restorative → Oral Surgery → Emergency.
  const items = showAll
    ? servicesByCategory().flatMap((g) => g.items)
    : services.filter((s) => s.featured);

  function nudge(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  return (
    <section id="services" data-chapter="Services" className="py-24 lg:py-32 anchor-offset">
      <ServiceIconDefs />
      <Container>
        <SectionHeader eyebrow={eyebrow} title={heading} description={description} />

        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="relative mt-14"
        >
          {/* edge fades hint that the row scrolls */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 z-10 bg-gradient-to-r from-(--color-bg) to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 z-10 bg-gradient-to-l from-(--color-bg) to-transparent" />

          {/* arrows (pointer devices) */}
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll services left"
            className="hidden md:grid place-items-center absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-(--color-surface) border border-(--color-brand-200) shadow-(--shadow-soft-md) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
          >
            <Icon name="arrow" className="w-4 h-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll services right"
            className="hidden md:grid place-items-center absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-(--color-surface) border border-(--color-brand-200) shadow-(--shadow-soft-md) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
          >
            <Icon name="arrow" className="w-4 h-4" />
          </button>

          <ul
            ref={trackRef}
            className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-1 pb-4 -mx-2 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((s) => (
              <li key={s.slug} className="snap-start shrink-0 w-[270px] sm:w-[300px]">
                <ServiceTile service={s} />
              </li>
            ))}
          </ul>
        </m.div>
      </Container>
    </section>
  );
}
