"use client";
import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useSpring } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { site } from "@/lib/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const ySlow = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), { stiffness: 80, damping: 20 });
  const yFast = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 80, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section ref={ref} className="relative pt-[72px] overflow-hidden">
      {/* Decorative gradient blobs */}
      <m.div
        style={{ y: ySlow }}
        className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-[--color-brand-200] via-[--color-brand-100] to-transparent blur-3xl opacity-70 -z-10"
      />
      <m.div
        style={{ y: yFast }}
        className="absolute top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[--color-accent]/20 via-[--color-brand-50] to-transparent blur-3xl opacity-70 -z-10"
      />

      <Container className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <m.div style={{ opacity }} className="lg:col-span-7">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow flex items-center gap-2"
          >
            <span className="w-8 h-px bg-[--color-brand-600]" />
            Aurora, Colorado · Since 2003
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[clamp(40px,6.5vw,76px)] leading-[0.98] font-display tracking-[-0.03em]"
          >
            Friendly Staff.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Beautiful Smiles.</span>
              <m.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 bottom-1 h-[14%] bg-[--color-brand-200]/70 origin-left -z-0"
              />
            </span>{" "}
            Welcoming Environment.
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 text-lg lg:text-xl text-[--color-ink-700] max-w-xl leading-relaxed"
          >
            Comprehensive family, cosmetic, and emergency dentistry led by
            Dr. Raed Ammari. Same-day visits available, most insurance accepted.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button href="/appointment" size="lg" iconEnd={<Icon name="arrow" className="w-4 h-4" />}>
              Book Appointment
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg" iconStart={<Icon name="phone" className="w-4 h-4" />}>
              {site.phone}
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            <Stat value={20} suffix="+" label="years in Aurora" />
            <Stat value={18} label="insurances accepted" />
            <Stat value={5} suffix="★" label="patient rated" />
          </m.div>
        </m.div>

        <m.div
          style={{ scale, opacity }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-gradient-to-br from-[--color-brand-100] to-[--color-brand-50] shadow-[--shadow-soft-lg]">
            <Image
              src="/images/practice/hero-1.webp"
              alt="Ammari Dental treatment room in Aurora, CO"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
            <m.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-8 w-20 h-20 rounded-full bg-[--color-brand-200]/40 blur-md"
              aria-hidden
            />
            <m.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 right-10 w-16 h-16 rounded-full bg-[--color-accent]/30 blur-md"
              aria-hidden
            />
          </div>

          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200, damping: 22 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-[--shadow-soft-lg] p-4 flex items-center gap-3 max-w-[260px]"
          >
            <div className="grid place-items-center w-10 h-10 rounded-full bg-[--color-success]/15 text-[--color-success]">
              <Icon name="calendar" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[--color-ink-500]">Now booking</div>
              <div className="text-sm font-semibold">Same-week openings</div>
            </div>
          </m.div>
        </m.div>
      </Container>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-display text-[--color-ink-900]">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-[--color-ink-500] mt-1 leading-tight">{label}</div>
    </div>
  );
}
