"use client";
import { useRef } from "react";
import Image from "next/image";
import {
  m,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function AboutSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], [-30, 30]), {
    stiffness: 80,
    damping: 22,
  });
  const curtainY = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-100%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 0.98]);

  return (
    <section id="about" data-chapter="About" ref={sectionRef} className="py-24 lg:py-32 bg-(--color-surface-muted)/50 relative anchor-offset">
      <Container className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <m.div
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
        >
          <m.div variants={fadeUp} className="eyebrow">Welcome</m.div>
          <SplitText
            as="h2"
            text="We'll Provide You With That Winning Smile!"
            className="mt-3 text-4xl lg:text-5xl font-display tracking-tight leading-[1.05]"
          />
          <m.p variants={fadeUp} className="mt-6 text-lg text-(--color-ink-700) leading-relaxed">
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
            ].map((b, i) => (
              <m.li
                key={b}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-(--color-brand-600) text-white">
                  <m.svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <m.path
                      d="m5 12 5 5L20 7"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    />
                  </m.svg>
                </span>
                {b}
              </m.li>
            ))}
          </m.ul>

          <m.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Button href="/dental-staff">Meet the Doctor</Button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Button href="/new-patients" variant="secondary">New Patient Info</Button>
            </Magnetic>
          </m.div>
        </m.div>

        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-[28px] shadow-(--shadow-soft-lg) overflow-hidden">
            <m.div
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src="/images/staff/dr-ammari.jpg"
                alt="Dr. Raed Ammari, DDS — Ammari Dental, Aurora, CO"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </m.div>

            <m.div
              style={{ y: curtainY }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--color-brand-700) via-(--color-brand-600) to-(--color-brand-400) origin-top"
              aria-hidden
            />
            <m.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute top-6 left-6 right-6 h-px bg-white/40 origin-left"
              aria-hidden
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-6 text-white">
              <m.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="font-display text-2xl"
              >
                Dr. Raed Ammari, DDS
              </m.div>
              <m.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="text-sm opacity-90 mt-1"
              >
                Family &amp; Cosmetic Dentistry
              </m.div>
              <m.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="mt-3 inline-block text-xs uppercase tracking-widest bg-white/15 backdrop-blur px-3 py-1 rounded-full font-semibold"
              >
                Aurora, CO
              </m.div>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 22 }}
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-(--shadow-soft-lg) px-5 py-4"
          >
            <div className="text-3xl font-display text-(--color-brand-700)">20+</div>
            <div className="text-xs text-(--color-ink-500)">years caring for Aurora</div>
          </m.div>
        </m.div>
      </Container>
    </section>
  );
}
