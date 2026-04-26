"use client";
import Image from "next/image";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function AboutSplit() {
  return (
    <section className="py-24 lg:py-32 bg-[--color-surface-muted]/50">
      <Container className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <m.div
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
        >
          <m.div variants={fadeUp} className="eyebrow">Welcome</m.div>
          <m.h2
            variants={fadeUp}
            className="mt-3 text-4xl lg:text-5xl font-display tracking-tight leading-[1.05]"
          >
            We&rsquo;ll Provide You With That Winning Smile!
          </m.h2>
          <m.p variants={fadeUp} className="mt-6 text-lg text-[--color-ink-700] leading-relaxed">
            For over two decades, Dr. Raed Ammari and our team have cared for
            Aurora families with gentle, modern dentistry. Whether you&rsquo;re
            here for a cleaning, a smile makeover, or a same-day emergency, we
            treat every patient like family.
          </m.p>

          <m.ul variants={fadeUp} className="mt-8 grid sm:grid-cols-2 gap-3">
            {[
              "New patient special",
              "Friendly, multilingual team",
              "Modern, comfortable office",
              "Most insurance accepted",
            ].map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-[--color-brand-600] text-white">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                </span>
                {b}
              </li>
            ))}
          </m.ul>

          <m.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Button href="/dental-staff">Meet the Doctor</Button>
            <Button href="/new-patients" variant="secondary">New Patient Info</Button>
          </m.div>
        </m.div>

        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-[28px] shadow-[--shadow-soft-lg] overflow-hidden">
            <Image
              src="/images/staff/dr-ammari.webp"
              alt="Dr. Raed Ammari, DDS — Ammari Dental, Aurora, CO"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 text-white">
              <div className="font-display text-2xl">Dr. Raed Ammari, DDS</div>
              <div className="text-sm opacity-90 mt-1">Family &amp; Cosmetic Dentistry</div>
              <div className="mt-3 inline-block text-xs uppercase tracking-widest bg-white/15 backdrop-blur px-3 py-1 rounded-full font-semibold">
                Aurora, CO
              </div>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
