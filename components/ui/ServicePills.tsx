"use client";
import { useRef } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/lib/services";
import { fadeIn, reveal } from "@/lib/motion";

// Curated quick-access chips, in a deliberate order.
const chipSlugs = [
  "dental-services",
  "dental-emergencies",
  "deep-cleaning",
  "teeth-whitening",
  "dental-implants",
  "dental-crowns",
  "veneers",
  "dentures",
  "root-canal",
] as const;

const chips = chipSlugs
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

export function ServicePills() {
  const trackRef = useRef<HTMLUListElement>(null);

  function nudge(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <m.div
      variants={fadeIn}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      className="relative"
    >
      {/* Edge fades */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-(--color-bg) to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-(--color-bg) to-transparent" />

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Scroll services left"
        className="hidden md:grid place-items-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-(--color-surface) border border-(--color-brand-200) shadow-(--shadow-soft-md) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
      >
        <Icon name="arrow" className="w-4 h-4 rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Scroll services right"
        className="hidden md:grid place-items-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-(--color-surface) border border-(--color-brand-200) shadow-(--shadow-soft-md) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
      >
        <Icon name="arrow" className="w-4 h-4" />
      </button>

      <ul
        ref={trackRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-2 md:px-12 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((s) => (
          <li key={s.slug} className="snap-start shrink-0">
            <Link
              href={`/${s.slug}`}
              className="group flex items-center gap-2 rounded-(--radius-pill) bg-(--color-surface) border border-(--color-brand-100) px-6 py-3.5 text-(--color-ink-800) font-medium whitespace-nowrap shadow-(--shadow-soft-sm) hover:bg-(--color-brand-50) hover:border-(--color-brand-300) hover:text-(--color-brand-700) transition-colors"
            >
              {s.name}
              <Icon
                name="arrow"
                className="w-3.5 h-3.5 text-(--color-brand-400) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              />
            </Link>
          </li>
        ))}
      </ul>
    </m.div>
  );
}
