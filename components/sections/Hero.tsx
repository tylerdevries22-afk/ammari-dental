"use client";
import { useRef } from "react";
import {
  m,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Magnetic } from "@/components/ui/MagneticButton";
import Image from "next/image";
import { site } from "@/lib/site";

const headlineWords = ["Friendly", "Staff.", "Beautiful", "Smiles.", "Welcoming", "Environment."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const ySlow = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), { stiffness: 80, damping: 20 });
  const yFast = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 80, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const sx = useSpring(cursorX, { stiffness: 50, damping: 18 });
  const sy = useSpring(cursorY, { stiffness: 50, damping: 18 });
  const flairX = useTransform(sx, [-1, 1], [-30, 30]);
  const flairY = useTransform(sy, [-1, 1], [-25, 25]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    cursorY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section
      id="welcome"
      data-chapter="Welcome"
      ref={ref}
      onMouseMove={onMove}
      className="relative pt-[72px] overflow-hidden"
    >
      <m.div
        style={{ y: ySlow, x: flairX }}
        className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-(--color-brand-200) via-(--color-brand-100) to-transparent blur-3xl opacity-70 -z-10"
      />
      <m.div
        style={{ y: yFast, x: flairY }}
        className="absolute top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-(--color-accent)/20 via-(--color-brand-50) to-transparent blur-3xl opacity-70 -z-10"
      />

      <svg
        aria-hidden
        viewBox="0 0 400 100"
        className="absolute top-[88px] right-8 w-[260px] h-[80px] -z-10 hidden lg:block"
      >
        <m.path
          d="M5 50 Q 80 5, 160 50 T 320 50 T 395 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-(--color-brand-300)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <Container className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <m.div style={{ opacity }} className="lg:col-span-7">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow flex items-center gap-2"
          >
            <m.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-8 h-px bg-(--color-brand-600) origin-left"
            />
            Aurora, Colorado · Since 2003
          </m.div>

          <h1 className="mt-5 text-[clamp(40px,6.5vw,76px)] leading-[0.98] font-display tracking-[-0.03em]">
            <m.span
              className="inline-flex flex-wrap"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
              }}
            >
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]"
                >
                  <m.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "115%" },
                      show: {
                        y: "0%",
                        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                  >
                    {word === "Smiles." ? (
                      <span className="relative inline-block">
                        <span className="relative z-10">{word}</span>
                        <m.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-0 right-0 bottom-1 h-[14%] bg-(--color-brand-200)/70 origin-left -z-0"
                        />
                      </span>
                    ) : (
                      word
                    )}
                    {i < headlineWords.length - 1 && "\u00A0"}
                  </m.span>
                </span>
              ))}
            </m.span>
          </h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-7 text-lg lg:text-xl text-(--color-ink-700) max-w-xl leading-relaxed"
          >
            Comprehensive family, cosmetic, and emergency dentistry led by
            Dr. Raed Ammari. Same-day visits available, most insurance accepted.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Magnetic strength={0.4}>
              <Button href="/appointment" size="lg" iconEnd={<Icon name="arrow" className="w-4 h-4" />}>
                Book Appointment
              </Button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg" iconStart={<Icon name="phone" className="w-4 h-4" />}>
                {site.phone}
              </Button>
            </Magnetic>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            <Stat value={20} suffix="+" label="years in Aurora" />
            <Stat value={18} label="insurances accepted" />
            <Stat value={5} suffix="★" label="patient rated" />
          </m.div>
        </m.div>

        <m.div
          style={{ scale, opacity, x: useTransform(sx, [-1, 1], [-12, 12]) }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-gradient-to-br from-(--color-brand-100) to-(--color-brand-50) shadow-(--shadow-soft-lg) noise-overlay">
            <Image
              src="/images/staff/dr-ammari.jpg"
              alt="Dr. Raed Ammari, DDS — Ammari Dental, Aurora, CO"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />

            <m.div
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-(--color-brand-700) origin-bottom z-[2]"
              aria-hidden
            />

            <m.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-8 w-20 h-20 rounded-full bg-(--color-brand-200)/40 blur-md pointer-events-none"
              aria-hidden
            />
            <m.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 right-10 w-16 h-16 rounded-full bg-(--color-accent)/30 blur-md pointer-events-none"
              aria-hidden
            />
          </div>

          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 22 }}
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

          <m.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.7, type: "spring", stiffness: 200, damping: 22 }}
            className="absolute top-6 -right-4 lg:-right-8 bg-white/90 backdrop-blur rounded-2xl shadow-(--shadow-soft-md) px-4 py-3 hidden md:flex items-center gap-2"
          >
            <span className="flex gap-0.5 text-(--color-accent)">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="w-3 h-3 fill-current" />
              ))}
            </span>
            <span className="text-xs font-semibold text-(--color-ink-700)">5.0 patient rated</span>
          </m.div>
        </m.div>
      </Container>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-(--color-ink-500) text-[11px] uppercase tracking-widest"
        aria-hidden
      >
        Scroll
        <span className="relative w-px h-10 overflow-hidden">
          <m.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-(--color-brand-600)"
          />
        </span>
      </m.div>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-display text-(--color-ink-900)">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-(--color-ink-500) mt-1 leading-tight">{label}</div>
    </div>
  );
}
