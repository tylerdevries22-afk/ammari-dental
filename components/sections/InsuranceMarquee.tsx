"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

export function InsuranceMarquee() {
  return (
    <section className="py-16 border-y border-[--color-brand-100] bg-white">
      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="text-center mb-8"
        >
          <div className="eyebrow">In-network with</div>
          <h3 className="mt-2 font-display text-2xl">Most major insurance accepted</h3>
        </m.div>
      </Container>
      <Marquee>
        {site.insurances.map((name) => (
          <div
            key={name}
            className="px-7 py-4 rounded-xl bg-[--color-surface-muted] text-[--color-ink-700] font-semibold whitespace-nowrap text-sm tracking-tight"
          >
            {name}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
