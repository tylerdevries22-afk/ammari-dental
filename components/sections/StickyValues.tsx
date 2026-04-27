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
  pillars: string[];
};

const steps: Step[] = [
  {
    tool: "mirror",
    number: "01",
    eyebrow: "Listening first",
    title: "We start with your story.",
    body:
      "Every smile is different. Before we recommend anything, we listen to what's bothering you and what you'd love to change. The plan is built around you — never a script.",
    pillars: ["Open dialogue", "No upsells", "Patient-first"],
  },
  {
    tool: "drill",
    number: "02",
    eyebrow: "Conservative care",
    title: "Less drilling. More dentistry.",
    body:
      "Modern materials and bonding techniques let us preserve more of your natural tooth structure. The most beautiful work is the work you don't notice.",
    pillars: ["Tooth preservation", "Modern bonding", "Minimally invasive"],
  },
  {
    tool: "polisher",
    number: "03",
    eyebrow: "Comfort, always",
    title: "Made for sensitive patients.",
    body:
      "Warm blankets, calming music, gentle anesthesia, and a team that takes its time. If you've been putting it off, we'll meet you where you are.",
    pillars: ["Sedation options", "Patient pacing", "Sensory care"],
  },
  {
    tool: "sparkle-cluster",
    number: "04",
    eyebrow: "Honest pricing",
    title: "No surprises at checkout.",
    body:
      "Written estimates, insurance verified up front, and CareCredit options when you need them. You'll know the number before you sit in the chair.",
    pillars: ["Upfront estimates", "Insurance verified", "CareCredit"],
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
    damping: 26,
    mass: 0.4,
  });

  const meshShift = useTransform(smooth, [0, 1], [0, -180]);
  const meshRotate = useTransform(smooth, [0, 1], [0, 35]);
  const gridShift = useTransform(smooth, [0, 1], [0, -90]);
  const auroraHue = useTransform(smooth, [0, 0.33, 0.66, 1], [0, -8, 6, -4]);
  const auroraSat = useTransform(smooth, [0, 0.5, 1], [1, 1.15, 1]);

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
          gridShift={gridShift}
          auroraHue={auroraHue}
          auroraSat={auroraSat}
          progress={smooth}
        />

        <Container className="relative z-10 h-full flex flex-col justify-center">
          <header className="max-w-2xl">
            <m.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-(--color-brand-200)">
                <span className="h-px w-10 bg-(--color-brand-300)" />
                How we work
              </div>
              <h2 className="mt-4 text-4xl lg:text-6xl font-display tracking-tight leading-[1.05] text-white">
                Four ideas behind every visit.
              </h2>
              <p className="mt-5 text-white/85 max-w-xl text-base lg:text-lg leading-relaxed">
                Two decades of practice in Aurora has taught us that great
                dentistry is mostly about the details — and how you make people
                feel along the way.
              </p>
            </m.div>
          </header>

          <div className="mt-10 lg:mt-14 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <Timeline progress={smooth} />

            <div className="lg:col-span-7 relative">
              <NumberStack progress={smooth} />
              {steps.map((s, i) => (
                <StepPanel
                  key={s.title}
                  index={i}
                  total={steps.length}
                  progress={smooth}
                  step={s}
                />
              ))}
              <div className="lg:h-[360px] h-[300px]" />
            </div>

            <ToolStage progress={smooth} />
          </div>

          <ProgressTrack progress={smooth} />
        </Container>
      </div>
    </section>
  );
}

function BackgroundLayer({
  meshShift,
  meshRotate,
  gridShift,
  auroraHue,
  auroraSat,
  progress,
}: {
  meshShift: MotionValue<number>;
  meshRotate: MotionValue<number>;
  gridShift: MotionValue<number>;
  auroraHue: MotionValue<number>;
  auroraSat: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  const filter = useTransform(
    [auroraHue, auroraSat] as MotionValue<number>[],
    ([h, s]) => `hue-rotate(${h}deg) saturate(${s})`,
  );
  const blobAX = useTransform(progress, [0, 1], ["-12%", "10%"]);
  const blobBY = useTransform(progress, [0, 1], ["8%", "-8%"]);

  return (
    <div aria-hidden className="absolute inset-0">
      <m.div
        style={{ y: meshShift, rotate: meshRotate, filter }}
        className="absolute -inset-1/3 aurora-gradient opacity-55"
      />
      <m.div
        style={{ x: blobAX }}
        className="absolute top-[18%] -right-[6%] w-[560px] h-[560px] rounded-full bg-(--color-accent)/12 blur-3xl"
      />
      <m.div
        style={{ y: blobBY }}
        className="absolute bottom-[-10%] left-[-8%] w-[480px] h-[480px] rounded-full bg-(--color-brand-400)/18 blur-3xl"
      />

      <m.svg
        style={{ y: gridShift }}
        className="absolute inset-0 w-full h-[140%] opacity-[0.08]"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern
            id="dots"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.6" cy="1.6" r="1.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect
          width="1440"
          height="1200"
          fill="url(#dots)"
          className="text-(--color-brand-200)"
        />
      </m.svg>

      <FloatingMotes progress={progress} />

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-(--color-brand-900) via-(--color-brand-900)/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-(--color-brand-900) via-(--color-brand-900)/70 to-transparent pointer-events-none" />
    </div>
  );
}

function FloatingMotes({ progress }: { progress: MotionValue<number> }) {
  const motes = [
    { x: 12, y: 24, size: 4, drift: -260, delay: 0 },
    { x: 78, y: 14, size: 3, drift: -340, delay: 0.1 },
    { x: 22, y: 70, size: 5, drift: -200, delay: 0.2 },
    { x: 66, y: 82, size: 3, drift: -300, delay: 0.3 },
    { x: 88, y: 56, size: 4, drift: -240, delay: 0.4 },
    { x: 8, y: 50, size: 3, drift: -320, delay: 0.5 },
    { x: 50, y: 32, size: 2, drift: -380, delay: 0.6 },
    { x: 38, y: 88, size: 4, drift: -280, delay: 0.7 },
  ];
  return (
    <div aria-hidden className="absolute inset-0">
      {motes.map((m_, i) => (
        <Mote key={i} {...m_} progress={progress} />
      ))}
    </div>
  );
}

function Mote({
  x,
  y,
  size,
  drift,
  delay,
  progress,
}: {
  x: number;
  y: number;
  size: number;
  drift: number;
  delay: number;
  progress: MotionValue<number>;
}) {
  const yMv = useTransform(progress, [0, 1], [delay * 60, drift]);
  const opacity = useTransform(
    progress,
    [0, 0.08, 0.92, 1],
    [0, 0.55, 0.55, 0],
  );
  return (
    <m.span
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        y: yMv,
        opacity,
      }}
      className="absolute rounded-full bg-(--color-brand-200) shadow-[0_0_12px_rgba(166,210,205,0.7)]"
    />
  );
}

function Timeline({ progress }: { progress: MotionValue<number> }) {
  return (
    <aside className="lg:col-span-2 relative hidden lg:block">
      <div className="relative h-[360px] flex flex-col justify-between">
        <div className="absolute left-[14px] top-0 bottom-0 w-px bg-white/10" />
        <m.div
          style={{ scaleY: progress, transformOrigin: "top" }}
          className="absolute left-[14px] top-0 bottom-0 w-px bg-gradient-to-b from-(--color-brand-200) via-(--color-brand-300) to-(--color-accent)"
        />
        {steps.map((s, i) => (
          <TimelineNode
            key={s.number}
            index={i}
            total={steps.length}
            progress={progress}
            step={s}
          />
        ))}
      </div>
    </aside>
  );
}

function TimelineNode({
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
  const peak = (start + end) / 2;

  const fill = useTransform(progress, [start - 0.04, peak], [0, 1]);
  const scale = useTransform(
    progress,
    [start - 0.05, peak, end + 0.05],
    [0.9, 1.15, 0.95],
  );
  const labelOpacity = useTransform(
    progress,
    [start - 0.04, start + 0.02, end - 0.02, end + 0.04],
    [0.4, 1, 1, 0.4],
  );
  const ringScale = useTransform(
    progress,
    [start, peak, end],
    [0.6, 1.6, 0.6],
  );
  const ringOpacity = useTransform(
    progress,
    [start, peak, end],
    [0, 0.6, 0],
  );

  return (
    <div className="relative pl-12">
      <m.span
        aria-hidden
        style={{ scale: ringScale, opacity: ringOpacity }}
        className="absolute left-[6px] top-0 w-5 h-5 rounded-full border border-(--color-brand-200)"
      />
      <m.span
        style={{ scale }}
        className="absolute left-[6px] top-0 w-5 h-5 rounded-full bg-(--color-brand-900) border-2 border-(--color-brand-300) grid place-items-center"
      >
        <m.span
          style={{ scale: fill }}
          className="block w-2.5 h-2.5 rounded-full bg-gradient-to-br from-(--color-brand-200) to-(--color-accent)"
        />
      </m.span>
      <m.div style={{ opacity: labelOpacity }}>
        <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-(--color-brand-200)">
          {step.number}
        </div>
        <div className="text-sm font-medium text-white mt-1 leading-snug">
          {step.eyebrow}
        </div>
      </m.div>
    </div>
  );
}

function NumberStack({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden
      className="absolute -top-10 -left-2 lg:-left-6 pointer-events-none select-none"
    >
      {steps.map((s, i) => (
        <BigNumber
          key={s.number}
          index={i}
          total={steps.length}
          progress={progress}
          value={s.number}
        />
      ))}
    </div>
  );
}

function BigNumber({
  index,
  total,
  progress,
  value,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  value: string;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;
  const fade = seg * 0.22;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const a = isFirst ? -1 : start - fade;
  const b = isFirst ? 0 : start + fade;
  const c = isLast ? 1 : end - fade;
  const d = isLast ? 2 : end + fade;

  const opacity = useTransform(progress, [a, b, c, d], [0, 0.16, 0.16, 0]);
  const y = useTransform(progress, [a, b, c, d], [80, 0, 0, -80]);
  const blur = useTransform(progress, [a, b, c, d], [12, 0, 0, 12]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <m.div
      style={{ opacity, y, filter }}
      className="absolute top-0 left-0 text-[14rem] lg:text-[20rem] font-display leading-none tracking-tighter text-(--color-brand-200)"
    >
      {value}
    </m.div>
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
  const b = isFirst ? 0 : start;
  const c = isLast ? 1 : end;
  const d = isLast ? 2 : end + fade;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [40, 0, 0, -40]);
  const blur = useTransform(progress, [a, b, c, d], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const titleWords = step.title.split(" ");

  return (
    <m.div
      style={{ opacity, y, filter }}
      className="absolute inset-x-0 top-8"
    >
      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-(--color-accent)">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-(--color-accent)/15 border border-(--color-accent)/40 text-[10px] tracking-normal">
            {step.number}
          </span>
          {step.eyebrow}
        </div>

        <h3 className="mt-5 text-3xl lg:text-5xl font-display tracking-tight leading-[1.05] text-white">
          {titleWords.map((w, i) => (
            <WordReveal
              key={i}
              word={w}
              index={i}
              start={Math.max(0, start)}
              end={Math.max(0, start) + Math.min(seg * 0.45, 0.12)}
              progress={progress}
              total={titleWords.length}
            />
          ))}
        </h3>

        <p className="mt-6 text-white/90 text-base lg:text-[17px] leading-[1.65] max-w-xl">
          {step.body}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {step.pillars.map((p, i) => (
            <PillarChip
              key={p}
              label={p}
              index={i}
              start={Math.max(0, start) + 0.04}
              end={Math.max(0, start) + 0.16}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </m.div>
  );
}

function WordReveal({
  word,
  index,
  start,
  end,
  progress,
  total,
}: {
  word: string;
  index: number;
  start: number;
  end: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const span = (end - start) * 0.5;
  const stepStart = start + (index / total) * span;
  const stepEnd = stepStart + span / total + 0.03;
  const opacity = useTransform(progress, [stepStart, stepEnd], [0, 1]);
  const y = useTransform(progress, [stepStart, stepEnd], [22, 0]);
  return (
    <m.span style={{ opacity, y }} className="inline-block mr-[0.25em]">
      {word}
    </m.span>
  );
}

function PillarChip({
  label,
  index,
  start,
  end,
  progress,
}: {
  label: string;
  index: number;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const span = (end - start) * 0.6;
  const a = start + 0.02 + index * 0.018;
  const b = a + span / 6 + 0.04;
  const opacity = useTransform(progress, [a, b], [0, 1]);
  const y = useTransform(progress, [a, b], [10, 0]);
  return (
    <m.span
      style={{ opacity, y }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-white/8 border border-white/12 text-white/85 backdrop-blur-sm"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-(--color-brand-300)" />
      {label}
    </m.span>
  );
}

function ToolStage({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="lg:col-span-3 relative aspect-square max-w-[420px] mx-auto w-full hidden lg:block">
      <m.div
        aria-hidden
        style={{ rotate: useTransform(progress, [0, 1], [0, 90]) }}
        className="absolute inset-[6%] rounded-full border border-dashed border-white/15"
      />
      <m.div
        aria-hidden
        style={{ rotate: useTransform(progress, [0, 1], [0, -120]) }}
        className="absolute inset-[18%] rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="absolute inset-[28%] rounded-full bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-md border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]"
      />

      {steps.map((s, i) => (
        <StageRipple
          key={s.tool}
          index={i}
          total={steps.length}
          progress={progress}
        />
      ))}

      {steps.map((s, i) => (
        <StageTool
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

function StageRipple({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = (index + 1) * seg;
  const peak = start + 0.05;

  const scale = useTransform(progress, [start, peak, end], [0.4, 2.4, 2.4]);
  const opacity = useTransform(
    progress,
    [start, peak, peak + 0.12],
    [0, 0.7, 0],
  );
  return (
    <m.span
      aria-hidden
      style={{ scale, opacity }}
      className="absolute inset-[28%] rounded-full border-2 border-(--color-brand-200)"
    />
  );
}

function StageTool({
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
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const a = isFirst ? -1 : start - fade;
  const b = isFirst ? 0 : start + fade;
  const c = isLast ? 1 : end - fade;
  const d = isLast ? 2 : end + fade;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const scale = useTransform(progress, [a, b, c, d], [0.5, 1, 1, 0.5]);
  const rotate = useTransform(progress, [a, b, c, d], [-22, 0, 0, 22]);

  return (
    <m.div
      style={{ opacity, scale, rotate }}
      className="absolute inset-0 grid place-items-center"
    >
      <div className="relative grid place-items-center w-32 h-32 rounded-3xl bg-white/12 border border-white/25 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
        <span className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
        <DentalIcon
          name={tool}
          className="relative w-14 h-14 text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]"
        />
      </div>
    </m.div>
  );
}

function ProgressTrack({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute bottom-8 left-0 right-0 px-6 lg:px-12">
      <div className="flex items-center gap-4 max-w-md">
        <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/60">
          Progress
        </span>
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
