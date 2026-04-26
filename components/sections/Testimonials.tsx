"use client";
import { useState, useRef } from "react";
import { m, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";

const reviews = [
  {
    quote:
      "Dr. Ammari and his team are incredible. The office is welcoming, and the staff truly cares. I have never had a better dental experience.",
    name: "Linda O.",
    rating: 5,
    accent: "from-(--color-brand-100) to-(--color-brand-50)",
  },
  {
    quote:
      "I've been going here for years. They're always professional, gentle, and they explain everything clearly. Highly recommend.",
    name: "Andy",
    rating: 5,
    accent: "from-(--color-brand-50) to-white",
  },
  {
    quote:
      "Got me in same-day for an emergency and fixed everything painlessly. Best dental office in Aurora.",
    name: "Maria S.",
    rating: 5,
    accent: "from-(--color-accent)/15 to-(--color-brand-50)",
  },
  {
    quote:
      "The cosmetic work transformed my smile and my confidence. Worth every visit.",
    name: "Devon T.",
    rating: 5,
    accent: "from-(--color-brand-100) to-white",
  },
];

const swipeThreshold = 60;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const dragRef = useRef<HTMLDivElement>(null);

  function paginate(d: 1 | -1) {
    setDirection(d);
    setIndex((i) => (i + d + reviews.length) % reviews.length);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -swipeThreshold) paginate(1);
    else if (info.offset.x > swipeThreshold) paginate(-1);
  }

  const r = reviews[index];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <Container>
        <SectionHeader
          eyebrow="What patients say"
          title="Testimonials"
          description="Real words from real patients who trust Ammari Dental with their smiles."
        />

        <div ref={dragRef} className="mt-16 relative max-w-3xl mx-auto h-[360px] md:h-[320px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <m.blockquote
              key={index}
              custom={direction}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: direction * 80, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -direction * 80, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
              className={`absolute inset-0 cursor-grab active:cursor-grabbing rounded-[28px] bg-gradient-to-br ${r.accent} border border-white/60 shadow-(--shadow-soft-lg) p-8 md:p-12 flex flex-col`}
            >
              <div className="flex gap-1 text-(--color-accent)">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <m.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 240, damping: 14 }}
                  >
                    <Icon name="star" className="w-5 h-5 fill-current" />
                  </m.span>
                ))}
              </div>
              <p className="mt-6 flex-1 font-display text-2xl md:text-3xl leading-snug text-(--color-ink-900)">
                &ldquo;{r.quote}&rdquo;
              </p>
              <footer className="mt-8 pt-6 border-t border-(--color-brand-200)/40 text-sm font-semibold text-(--color-ink-700)">
                — {r.name}, Aurora patient
              </footer>
            </m.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
            className="w-11 h-11 grid place-items-center rounded-full border border-(--color-brand-200) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
          >
            <Icon name="arrow" className="w-4 h-4 rotate-180" />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className="relative h-2 rounded-full overflow-hidden bg-(--color-brand-100) transition-all"
                style={{ width: i === index ? 32 : 8 }}
              >
                {i === index && (
                  <m.span
                    layoutId="testimonial-pip"
                    className="absolute inset-0 bg-(--color-brand-600)"
                    transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
            className="w-11 h-11 grid place-items-center rounded-full border border-(--color-brand-200) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
          >
            <Icon name="arrow" className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
