"use client";
import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { DentalIcon } from "@/components/ui/DentalIcon";

type Step = {
  tool: string;
  eyebrow: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    tool: "mirror",
    eyebrow: "01 — Listening first",
    title: "We start with your story.",
    body:
      "Every smile is different. Before we recommend anything, we listen to what's bothering you and what you'd love to change. The plan is built around you — never a script.",
  },
  {
    tool: "drill",
    eyebrow: "02 — Conservative care",
    title: "Less drilling. More dentistry.",
    body:
      "Modern materials and bonding techniques let us preserve more of your natural tooth structure. The most beautiful work is the work you don't notice.",
  },
  {
    tool: "polisher",
    eyebrow: "03 — Comfort, always",
    title: "Made for sensitive patients.",
    body:
      "Warm blankets, calming music, gentle anesthesia, and a team that takes its time. If you've been putting it off, we'll meet you where you are.",
  },
  {
    tool: "sparkle-cluster",
    eyebrow: "04 — Honest pricing",
    title: "No surprises at checkout.",
    body:
      "Written estimates, insurance verified up front, and CareCredit options when you need them. You'll know the number before you sit in the chair.",
  },
];

const ambient = [
  { icon: "tooth", x: 8, y: 14, size: 28, delay: 0 },
  { icon: "sparkle-cluster", x: 84, y: 22, size: 22, delay: 0.15 },
  { icon: "syringe", x: 18, y: 78, size: 26, delay: 0.3 },
  { icon: "floss", x: 78, y: 70, size: 24, delay: 0.45 },
  { icon: "light", x: 62, y: 8, size: 20, delay: 0.6 },
  { icon: "tooth-sparkle", x: 6, y: 50, size: 24, delay: 0.75 },
];

export function StickyValues() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const blobX = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.96, 1],
    [0, 1, 1, 0],
  );
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const toothScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.05, 0.95]);

  return (
    <section
      ref={ref}
      className="relative bg-(--color-brand-900) text-white"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <m.div
            style={{ y: bgY, rotate: bgRotate }}
            className="absolute -top-1/3 -left-1/3 w-[160%] h-[160%] aurora-gradient opacity-50"
          />
          <m.div
            style={{ x: blobX }}
            className="absolute top-1/3 right-[-10%] w-[520px] h-[520px] rounded-full bg-(--color-accent)/10 blur-3xl"
          />
          <m.div
            style={{ x: blobX }}
            className="absolute bottom-[-10%] left-[-10%] w-[440px] h-[440px] rounded-full bg-(--color-brand-400)/15 blur-3xl"
          />
        </div>

        <Container className="relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <m.div style={{ opacity: headingOpacity }}>
              <div className="text-xs font-semibold tracking-[0.22em] uppercase text-(--color-brand-200)">
                How we work
              </div>
              <h2 className="mt-3 text-4xl lg:text-6xl font-display tracking-tight leading-[1.05] text-white">
                Four ideas behind every visit.
              </h2>
              <p className="mt-6 text-white/70 max-w-md leading-relaxed">
                Two decades of practice in Aurora has taught us that great
                dentistry is mostly about the details — and how you make
                people feel along the way.
              </p>
            </m.div>

            <div className="mt-10 relative h-[200px] lg:h-[180px]">
              {steps.map((s, i) => (
                <StepText
                  key={s.title}
                  index={i}
                  total={steps.length}
                  progress={scrollYProgress}
                  step={s}
                />
              ))}
            </div>

            <ScrollPips count={steps.length} progress={scrollYProgress} />
          </div>

          <div className="lg:col-span-7 relative aspect-square max-w-[560px] mx-auto w-full">
            <Stage
              progress={scrollYProgress}
              ringRotate={ringRotate}
              toothScale={toothScale}
            />
          </div>
        </Container>
      </div>
    </section>
  );
}

function StepText({
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

  const a = start;
  const b = start + fade;
  const c = end - fade;
  const d = end;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [16, 0, 0, -16]);

  return (
    <m.div
      style={{ opacity, y }}
      className="absolute inset-0"
    >
      <div className="text-xs font-semibold tracking-[0.22em] uppercase text-(--color-brand-200)">
        {step.eyebrow}
      </div>
      <h3 className="mt-2 text-2xl lg:text-3xl font-display tracking-tight leading-tight text-white">
        {step.title}
      </h3>
      <p className="mt-3 text-white/75 leading-relaxed text-[15px] lg:text-base max-w-md">
        {step.body}
      </p>
    </m.div>
  );
}

function Stage({
  progress,
  ringRotate,
  toothScale,
}: {
  progress: MotionValue<number>;
  ringRotate: MotionValue<number>;
  toothScale: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0">
      {ambient.map((a, i) => (
        <AmbientIcon key={i} icon={a.icon} x={a.x} y={a.y} size={a.size} delay={a.delay} progress={progress} />
      ))}

      <m.div
        aria-hidden
        style={{ rotate: ringRotate }}
        className="absolute inset-[10%] rounded-full border border-dashed border-white/15"
      />
      <m.div
        aria-hidden
        style={{ rotate: useNegRotate(ringRotate) }}
        className="absolute inset-[20%] rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="absolute inset-[30%] rounded-full bg-gradient-to-br from-white/8 to-transparent backdrop-blur-sm"
      />

      <m.div
        style={{ scale: toothScale }}
        className="absolute inset-0 grid place-items-center text-white"
      >
        <DentalIcon name="tooth" className="w-32 h-32 lg:w-40 lg:h-40 drop-shadow-[0_8px_30px_rgba(255,255,255,0.25)]" />
      </m.div>

      {steps.map((s, i) => (
        <ToolDock
          key={s.tool}
          index={i}
          total={steps.length}
          tool={s.tool}
          progress={progress}
        />
      ))}
    </div>
  );
}

function useNegRotate(mv: MotionValue<number>) {
  return useTransform(mv, (v) => -v * 0.6);
}

function ToolDock({
  index,
  total,
  tool,
  progress,
}: {
  index: number;
  total: number;
  tool: string;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;
  const fade = seg * 0.18;

  const a = start;
  const b = start + fade;
  const c = end - fade;
  const d = end;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const scale = useTransform(progress, [a, b, c, d], [0.6, 1, 1, 0.6]);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const rx = Math.cos(angle) * 38;
  const ry = Math.sin(angle) * 38;

  return (
    <m.div
      style={{ opacity, scale, left: `${50 + rx}%`, top: `${50 + ry}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative grid place-items-center w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_10px_40px_-8px_rgba(0,0,0,0.4)]">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent" />
        <DentalIcon name={tool} className="relative w-9 h-9 lg:w-11 lg:h-11 text-white" />
      </div>
    </m.div>
  );
}

function AmbientIcon({
  icon,
  x,
  y,
  size,
  delay,
  progress,
}: {
  icon: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 0.18, 0.18, 0]);
  const yMv = useTransform(progress, [0, 1], [delay * 30, -delay * 30 - 20]);
  return (
    <m.div
      style={{ opacity, left: `${x}%`, top: `${y}%`, y: yMv }}
      className="absolute text-white/70"
    >
      <DentalIcon name={icon} style={{ width: size, height: size }} />
    </m.div>
  );
}

function ScrollPips({
  count,
  progress,
}: {
  count: number;
  progress: MotionValue<number>;
}) {
  return (
    <div className="mt-8 flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <ScrollPip key={i} index={i} count={count} progress={progress} />
      ))}
    </div>
  );
}

function ScrollPip({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / count;
  const start = index * seg;
  const end = (index + 1) * seg;
  const d = Math.min(1, end + 0.04);
  const c = Math.min(end, d - 0.001);
  const b = Math.min(start, c - 0.001);
  const a = Math.max(0, Math.min(start - 0.04, b - 0.001));

  const opacity = useTransform(progress, [a, b, c, d], [0.25, 1, 1, 0.25]);
  const width = useTransform(progress, [a, b, c, d], [16, 40, 40, 16]);
  return (
    <m.div
      style={{ opacity, width }}
      className="h-[3px] bg-(--color-brand-200) rounded-full"
    />
  );
}
