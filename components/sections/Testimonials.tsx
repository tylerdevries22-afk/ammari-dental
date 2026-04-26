"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, stagger, reveal } from "@/lib/motion";

const reviews = [
  {
    quote:
      "Dr. Ammari and his team are incredible. The office is welcoming, and the staff truly cares. I have never had a better dental experience.",
    name: "Linda O.",
    rating: 5,
  },
  {
    quote:
      "I've been going here for years. They're always professional, gentle, and they explain everything clearly. Highly recommend.",
    name: "Andy",
    rating: 5,
  },
  {
    quote:
      "Got me in same-day for an emergency and fixed everything painlessly. Best dental office in Aurora.",
    name: "Maria S.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="What patients say"
          title="Testimonials"
          description="Real words from real patients who trust Ammari Dental with their smiles."
        />

        <m.ul
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {reviews.map((r) => (
            <m.li
              key={r.name}
              variants={fadeUp}
              className="p-7 rounded-2xl bg-white border border-[--color-brand-100] shadow-[--shadow-soft-sm] flex flex-col"
            >
              <div className="flex gap-1 text-[--color-accent]">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Icon key={i} name="star" className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-xl leading-snug text-[--color-ink-900]">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <div className="mt-6 pt-5 border-t border-[--color-brand-100] text-sm font-semibold text-[--color-ink-700]">
                — {r.name}
              </div>
            </m.li>
          ))}
        </m.ul>
      </Container>
    </section>
  );
}
