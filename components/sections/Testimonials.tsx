"use client";
import { useState, useRef } from "react";
import { m, AnimatePresence, type PanInfo } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { useMotion } from "@/lib/useMotion";
import { site } from "@/lib/site";

// Verbatim patient reviews (Healthgrades, Dr. Raed Ammari — all 5★). The
// aggregate Google rating (4.9 / 500+) is shown via the badge below.
const reviews = [
  {
    quote:
      "He was thorough in his explanations. He made sure I understood what the procedures were going to entail. His staff made sure I had options for paying for procedures. Both he and his staff were very friendly and open and not in a chaotic hurry.",
    name: "Linda O.",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-brand-100) to-(--color-brand-50)",
  },
  {
    quote:
      "I have been going to Dr. Ammari for over 10 years now. He always provides compassionate, gentle dental care. No guilt trips or reprimands when work is needed. Dental procedures are as pain free and comfortable as possible.",
    name: "Verified patient",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-brand-50) to-(--color-surface)",
  },
  {
    quote:
      "His expertise is a level above everyone else I've been to. I've had a lot of dental work done with very little or no pain at all. He's attentive to my concerns and takes the time to explain the procedure before starting. The staff is very welcoming.",
    name: "Verified patient",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-accent)/15 to-(--color-brand-50)",
  },
  {
    quote:
      "Best dentist I have been to in Aurora. He is so honest and professional!",
    name: "Andy",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-brand-100) to-(--color-surface)",
  },
  {
    quote:
      "Dr. Ammari is very professional. Very thorough and caring. Highly recommended!",
    name: "Desiree Jordan",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-brand-50) to-(--color-surface)",
  },
  {
    quote:
      "I highly recommend! Painless and straight to business. Excellent work all the time and every time.",
    name: "S Neal",
    source: "Healthgrades",
    rating: 5,
    accent: "from-(--color-accent)/15 to-(--color-brand-50)",
  },
];

const swipeThreshold = 60;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { reduced } = useMotion();
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
    <section id="reviews" data-chapter="Reviews" className="py-24 lg:py-32 relative overflow-hidden anchor-offset">
      <Container>
        <SectionHeader
          eyebrow="What patients say"
          title="Testimonials"
          description="Real words from real patients who trust Ammari Dental with their smiles."
        />

        {/* Real aggregate Google rating */}
        <a
          href={site.social.google}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 mx-auto flex w-fit items-center gap-2.5 rounded-(--radius-pill) border border-(--color-brand-100) bg-(--color-surface) px-4 py-2 shadow-(--shadow-soft-sm) hover:border-(--color-brand-300) transition-colors"
        >
          <span className="text-(--color-accent-600) text-sm tracking-tight" aria-hidden>★★★★★</span>
          <span className="text-sm font-semibold text-(--color-ink-800)">4.9 · 500+ Google reviews</span>
          <Icon name="arrow" className="w-3.5 h-3.5 text-(--color-brand-500) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </a>

        <div ref={dragRef} className="mt-8 max-w-2xl mx-auto">
          <AnimatePresence initial={false} mode="wait">
            <m.blockquote
              key={index}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`cursor-grab active:cursor-grabbing rounded-(--radius-2xl) bg-gradient-to-br ${r.accent} border border-(--color-brand-100) shadow-(--shadow-soft-lg) p-6 sm:p-9 lg:p-10 flex flex-col min-h-[240px] sm:min-h-[220px]`}
            >
              <div className="flex gap-1 text-(--color-accent-600)" aria-hidden>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Icon key={i} name="star" className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </div>
              <p className="mt-5 flex-1 font-display text-[clamp(1.125rem,0.95rem+1.1vw,1.6rem)] leading-relaxed text-(--color-ink-900) text-balance">
                &ldquo;{r.quote}&rdquo;
              </p>
              <footer className="mt-6 pt-5 border-t border-(--color-brand-200)/50 flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-(--color-ink-800)">{r.name}</span>
                <span className="text-xs text-(--color-ink-500)">· verified {r.source} review</span>
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
