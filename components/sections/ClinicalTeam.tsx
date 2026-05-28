"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { fadeUp, stagger, reveal } from "@/lib/motion";

const qualifiers = [
  {
    title: "20+ years in Aurora",
    body: "Dr. Raed Ammari has cared for local families since 2003 — the same trusted hands, visit after visit.",
  },
  {
    title: "Modern, gentle care",
    body: "Up-to-date techniques and a calm, anxiety-aware approach so every appointment feels easy.",
  },
  {
    title: "Outcomes, not quotas",
    body: "We recommend only the care you actually need, and explain every option in plain language.",
  },
  {
    title: "Safety first, always",
    body: "Strict sterilization and modern protocols keep every patient — and our team — protected.",
  },
];

export function ClinicalTeam() {
  return (
    <section
      id="care"
      data-chapter="Our standard"
      className="relative py-24 lg:py-32 bg-(--color-surface-warm) overflow-hidden anchor-offset"
    >
      <Container className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Opposing-drift oval portrait pair */}
        <div className="relative order-last lg:order-first">
          <div className="relative mx-auto max-w-[460px] aspect-[5/6]">
            <ParallaxImage
              src="/images/generated/people/woman-40s.webp"
              alt="A patient smiling warmly after care at Ammari Dental"
              shape="oval"
              aspect="2 / 3"
              direction="normal"
              speed={0.13}
              sizes="(max-width: 1024px) 55vw, 24vw"
              className="absolute left-0 top-0 w-[58%] shadow-(--shadow-soft-lg) ring-1 ring-(--color-brand-100)"
            />
            <ParallaxImage
              src="/images/generated/people/senior-man.webp"
              alt="An older patient with a kind smile at Ammari Dental"
              shape="oval"
              aspect="2 / 3"
              direction="reverse"
              speed={0.19}
              sizes="(max-width: 1024px) 50vw, 22vw"
              className="absolute right-0 bottom-0 w-[54%] shadow-(--shadow-soft-lg) ring-1 ring-(--color-brand-100)"
            />
            {/* Soft brand panel behind, for the airy color-field feel */}
            <div
              aria-hidden
              className="absolute -z-10 left-[12%] top-[14%] w-[64%] aspect-square rounded-[50%] bg-(--color-brand-100)/60 blur-2xl"
            />
            {/* Rating chip travelling over the pair */}
            <m.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white rounded-(--radius-pill) shadow-(--shadow-soft-lg) px-5 py-2.5 flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-(--color-accent) text-sm tracking-tight">★★★★★</span>
              <span className="text-sm font-semibold text-(--color-ink-800)">5.0 patient rated</span>
            </m.div>
          </div>
        </div>

        {/* Qualifiers */}
        <m.div
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
        >
          <SectionHeader
            eyebrow="The Ammari standard"
            title="Care measured in smiles, not quotas"
            description="A small, dedicated team and one experienced dentist — so your care stays personal from your first cleaning to a full smile makeover."
            align="left"
          />

          <m.ul variants={fadeUp} className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {qualifiers.map((q) => (
              <li key={q.title} className="flex gap-3.5">
                <span className="mt-1 grid place-items-center w-7 h-7 shrink-0 rounded-full bg-(--color-brand-600) text-white">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-xl leading-snug text-(--color-ink-900)">{q.title}</h3>
                  <p className="mt-1.5 text-sm text-(--color-ink-700) leading-relaxed">{q.body}</p>
                </div>
              </li>
            ))}
          </m.ul>
        </m.div>
      </Container>
    </section>
  );
}
