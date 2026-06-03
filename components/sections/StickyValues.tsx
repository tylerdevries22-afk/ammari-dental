"use client";
import { useRef } from "react";
import {
  m,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { DentalIcon } from "@/components/ui/DentalIcon";

type Step = {
  tool: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    tool: "mirror",
    number: "01",
    eyebrow: "Listening first",
    title: "We start with your story.",
    body:
      "Every smile is different. Before we recommend anything, we listen to what's bothering you and what you'd love to change. The plan is built around you — never a script.",
  },
  {
    tool: "drill",
    number: "02",
    eyebrow: "Conservative care",
    title: "Less drilling. More dentistry.",
    body:
      "Modern materials and bonding techniques let us preserve more of your natural tooth structure. The most beautiful work is the work you don't notice.",
  },
  {
    tool: "polisher",
    number: "03",
    eyebrow: "Comfort, always",
    title: "Made for sensitive patients.",
    body:
      "Warm blankets, calming music, gentle anesthesia, and a team that takes its time. If you've been putting it off, we'll meet you where you are.",
  },
  {
    tool: "sparkle-cluster",
    number: "04",
    eyebrow: "Honest pricing",
    title: "No surprises at checkout.",
    body:
      "Written estimates, insurance verified up front, and CareCredit options when you need them. You'll know the number before you sit in the chair.",
  },
];

export function StickyValues() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  const meshShift = useTransform(smooth, [0, 1], [0, -160]);
  const meshRotate = useTransform(smooth, [0, 1], [0, 25]);

  return (
    <section
      ref={ref}
      className="relative bg-(--color-brand-900) text-white"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <BackgroundLayer
          meshShift={meshShift}
          meshRotate={meshRotate}
          progress={smooth}
        />

        <Container className="relative z-10 h-full flex flex-col justify-center py-20">
          <header>
            <m.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-(--color-brand-200)"
            >
              <span className="h-px w-10 bg-(--color-brand-300)" />
              How we work
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30%" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight leading-[1.08] text-white max-w-2xl"
            >
              Four ideas behind every visit.
            </m.h2>
          </header>

          <StepPager progress={smooth} />

          <ProgressTrack progress={smooth} />
        </Container>
      </div>
    </section>
  );
}

function BackgroundLayer({
  meshShift,
  meshRotate,
  progress,
}: {
  meshShift: MotionValue<number>;
  meshRotate: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  const blobAX = useTransform(progress, [0, 1], ["-12%", "10%"]);
  const blobBY = useTransform(progress, [0, 1], ["8%", "-8%"]);

  return (
    <div aria-hidden className="absolute inset-0">
      <m.div
        style={{ y: meshShift, rotate: meshRotate }}
        className="absolute -inset-1/3 aurora-gradient opacity-40"
      />
      <m.div
        style={{ x: blobAX }}
        className="absolute top-[10%] -right-[10%] w-[620px] h-[620px] rounded-full bg-(--color-accent)/12 blur-3xl"
      />
      <m.div
        style={{ y: blobBY }}
        className="absolute bottom-[-15%] -left-[10%] w-[520px] h-[520px] rounded-full bg-(--color-brand-400)/18 blur-3xl"
      />

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-(--color-brand-900) via-(--color-brand-900)/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-(--color-brand-900) via-(--color-brand-900)/70 to-transparent pointer-events-none" />
    </div>
  );
}

function StepPager({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mt-10 lg:mt-14 grid lg:grid-cols-12 gap-10 items-start">
      <StepNav progress={progress} />
      <div className="lg:col-span-8 relative min-h-[320px] lg:min-h-[260px]">
        {steps.map((s, i) => (
          <StepPanel
            key={s.title}
            index={i}
            total={steps.length}
            progress={progress}
            step={s}
          />
        ))}
      </div>
    </div>
  );
}

function StepNav({ progress }: { progress: MotionValue<number> }) {
  return (
    <nav className="lg:col-span-4">
      <ol className="flex lg:flex-col gap-2 lg:gap-4 justify-between lg:justify-start">
        {steps.map((s, i) => (
          <StepNavItem
            key={s.number}
            index={i}
            total={steps.length}
            progress={progress}
            step={s}
          />
        ))}
      </ol>
    </nav>
  );
}

function StepNavItem({
  index,
  total,
  progress,
  step,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  step: Step;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const a = isFirst ? -1 : start;
  const b = isLast ? 2 : end;

  const activeOpacity = useTransform(progress, [a, a + 0.001, b - 0.001, b], [0, 1, 1, 0]);
  const dotScale = useTransform(progress, [a - 0.04, a + 0.04, b - 0.04, b + 0.04], [0.85, 1.2, 1.2, 0.85]);
  const labelColor = useTransform(activeOpacity, (v) =>
    v > 0.5 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.45)",
  );

  return (
    <li className="relative flex items-center gap-3 lg:gap-4 lg:flex-none min-w-0">
      <m.span
        style={{ scale: dotScale }}
        className="relative grid place-items-center w-7 h-7 shrink-0 rounded-full border border-white/20 bg-white/5"
      >
        <m.span
          style={{ opacity: activeOpacity }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-(--color-brand-200) to-(--color-accent) shadow-[0_0_24px_rgba(161,222,188,0.55)]"
        />
        <span className="relative text-[10px] font-semibold tracking-wider text-(--color-brand-900) mix-blend-screen">
          {step.number}
        </span>
      </m.span>
      <m.span
        style={{ color: labelColor }}
        className="hidden lg:inline text-[15px] font-medium tracking-tight truncate transition-colors"
      >
        {step.eyebrow}
      </m.span>
    </li>
  );
}

function StepPanel({
  index,
  total,
  progress,
  step,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  step: Step;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;
  const fade = seg * 0.18;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const a = isFirst ? -1 : start - fade;
  const b = isFirst ? 0 : start + fade;
  const c = isLast ? 1 : end - fade;
  const d = isLast ? 2 : end + fade;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [24, 0, 0, -24]);

  return (
    <m.article
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0"
    >
      <div className="flex items-center gap-3 text-(--color-accent) text-xs font-semibold tracking-[0.28em] uppercase">
        <DentalIcon name={step.tool} className="w-4 h-4" />
        <span>{step.eyebrow}</span>
      </div>

      <h3 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-display tracking-tight leading-[1.1] text-white">
        {step.title}
      </h3>

      <p className="mt-5 text-white text-base sm:text-lg leading-[1.7] max-w-[55ch]">
        {step.body}
      </p>
    </m.article>
  );
}

function ProgressTrack({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-12">
      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <m.div
            style={{ width: fill }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-(--color-brand-300) via-(--color-brand-200) to-(--color-accent)"
          />
        </div>
        <ProgressLabel progress={progress} />
      </div>
    </div>
  );
}

function ProgressLabel({ progress }: { progress: MotionValue<number> }) {
  const idx = useTransform(progress, (v) =>
    String(Math.min(steps.length, Math.floor(v * steps.length) + 1)).padStart(
      2,
      "0",
    ),
  );
  return (
    <span className="text-[11px] font-semibold tracking-[0.24em] text-white/80 tabular-nums inline-flex items-baseline">
      <m.span>{idx}</m.span>
      <span className="text-white/40"> / 0{steps.length}</span>
    </span>
  );
}
