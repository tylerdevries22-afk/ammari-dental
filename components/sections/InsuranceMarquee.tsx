"use client";
import Image from "next/image";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SmoothMarquee } from "@/components/ui/SmoothMarquee";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

type Insurance = (typeof site.insurances)[number];

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
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-white to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-white to-transparent" />

        <SmoothMarquee durationSec={70}>
          {site.insurances.map((ins) => (
            <InsuranceTile key={ins.slug} ins={ins} />
          ))}
        </SmoothMarquee>

        <SmoothMarquee durationSec={90} reverse className="mt-6">
          {[...site.insurances].reverse().map((ins) => (
            <InsuranceTile key={`r-${ins.slug}`} ins={ins} />
          ))}
        </SmoothMarquee>
      </div>
    </section>
  );
}

function InsuranceTile({ ins }: { ins: Insurance }) {
  return (
    <div className="group flex items-center justify-center h-20 w-44 px-6 rounded-2xl bg-white border border-(--color-brand-100) shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-12px_rgba(15,55,50,0.18)] transition-shadow">
      <Image
        src={ins.logo}
        alt={ins.name}
        width={160}
        height={40}
        sizes="160px"
        loading="lazy"
        className="max-h-10 max-w-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
