"use client";
import Image from "next/image";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SmoothMarquee } from "@/components/ui/SmoothMarquee";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

export function InsuranceMarquee() {
  return (
    <section className="py-20 border-y border-(--color-brand-100) bg-white">
      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="text-center mb-10"
        >
          <div className="eyebrow">In-network with</div>
          <h3 className="mt-2 font-display text-2xl">Most major insurance accepted</h3>
        </m.div>
      </Container>

      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent" />

        <SmoothMarquee durationSec={70}>
          {site.insurances.map((ins) => (
            <InsuranceChip key={ins.slug} name={ins.name} slug={ins.slug} />
          ))}
        </SmoothMarquee>

        <SmoothMarquee durationSec={90} reverse className="mt-5">
          {[...site.insurances].reverse().map((ins) => (
            <InsuranceChip key={`r-${ins.slug}`} name={ins.name} slug={ins.slug} />
          ))}
        </SmoothMarquee>
      </div>
    </section>
  );
}

function InsuranceChip({ name, slug }: { name: string; slug: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-(--color-surface-muted) border border-(--color-brand-100)/60 shadow-[0_1px_0_rgba(0,0,0,0.02)] whitespace-nowrap">
      <Image
        src={`/images/insurance/${slug}.svg`}
        alt=""
        width={28}
        height={28}
        className="w-7 h-7 shrink-0 rounded-full"
        loading="lazy"
      />
      <span className="text-sm font-semibold tracking-tight text-(--color-ink-700)">
        {name}
      </span>
    </div>
  );
}
