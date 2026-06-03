"use client";
import { useRef } from "react";
import {
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { ScrollScrubVideo } from "@/components/ui/ScrollScrubVideo";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function AboutSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const curtainY = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-100%"]);

  return (
    <section id="about" data-chapter="About" ref={sectionRef} className="py-24 lg:py-32 bg-(--color-surface-warm) relative anchor-offset">
      <Container className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <m.div
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
        >
          <m.div variants={fadeUp} className="eyebrow">Meet Dr. Ammari</m.div>
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
              "Gentle, judgment-free care",
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
            <ScrollScrubVideo
              src="/videos/hero-scrub.mp4"
              poster="/images/practice/dentist-poster.webp"
              posterAlt="Dr. Raed Ammari providing dental care at Ammari Dental, Aurora, CO"
              scrollTarget={sectionRef}
              parallax={40}
              endAt={0.65}
            />

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
          </div>

          {/* Booking badge — travels with the video */}
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 22 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-(--shadow-soft-lg) p-4 flex items-center gap-3 max-w-[260px]"
          >
            <m.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="grid place-items-center w-10 h-10 rounded-full bg-(--color-success)/15 text-(--color-success)"
            >
              <Icon name="calendar" className="w-5 h-5" />
            </m.span>
            <div>
              <div className="text-xs text-(--color-ink-500)">Now booking</div>
              <div className="text-sm font-semibold">Same-week openings</div>
            </div>
          </m.div>

          {/* Rating badge — travels with the video */}
          <m.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 22 }}
            className="absolute top-6 -right-4 lg:-right-8 bg-white/90 backdrop-blur rounded-2xl shadow-(--shadow-soft-md) px-4 py-3 hidden md:flex items-center gap-2"
          >
            <span className="flex gap-0.5 text-(--color-accent-600)">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="w-3 h-3 fill-current" />
              ))}
            </span>
            <span className="text-xs font-semibold text-(--color-ink-700)">5.0 patient rated</span>
          </m.div>
        </m.div>
      </Container>
    </section>
  );
}
