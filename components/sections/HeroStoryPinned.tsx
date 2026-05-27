"use client";
import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Icon } from "@/components/ui/Icon";
import { useMotion } from "@/lib/useMotion";

const beats = [
  {
    eyebrow: "Step 01",
    headline: "Greeted in under 2 minutes",
    body: "From the moment you walk in, no waiting rooms with magazines from last decade. A short hello, a warm drink, and a brief check-in.",
    stat: { value: 2, suffix: " min", label: "average front-desk check-in" },
    iconName: "calendar" as const,
  },
  {
    eyebrow: "Step 02",
    headline: "Modern operatory, calm hands",
    body: "Quiet equipment, soft light, ergonomic chairs. Twenty minutes feels like ten because nothing is jarring — by design.",
    stat: { value: 100, suffix: "%", label: "HIPAA-compliant digital records" },
    iconName: "shield" as const,
  },
  {
    eyebrow: "Step 03",
    headline: "Outcomes you can see",
    body: "We finish with a clear summary, a written plan if work continues, and time for every question. You leave knowing.",
    stat: { value: 5, suffix: " ★", label: "patient rating across 200+ reviews" },
    iconName: "star" as const,
  },
];

/**
 * Pinned three-beat story section below the hero.
 *
 * Behavior:
 *  - Section is 300vh tall; inner content pins to viewport for 200vh of scroll
 *  - Three beats transition into view at scroll progress 0–0.33, 0.33–0.66,
 *    0.66–1.0
 *  - Each beat: eyebrow + display headline + paragraph + stat counter
 *  - A "chapter dot" rail on the right tracks active beat
 *  - Under reduced-motion: beats stack vertically with no pinning
 */
export function HeroStoryPinned() {
  const { enabled } = useMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Each beat fades in for its range, then out for the next
  const beatRanges = beats.map((_, i) => {
    const start = i / beats.length;
    const end = (i + 1) / beats.length;
    return { start, mid: (start + end) / 2, end };
  });

  // Reduced-motion fallback: simple stacked layout
  if (!enabled) {
    return (
      <section className="bg-(--surface-deep) text-(--color-brand-50) py-20">
        <Container>
          <div className="grid gap-16">
            {beats.map((beat, i) => (
              <Beat key={i} beat={beat} static />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-(--surface-deep) text-(--color-brand-50)"
      style={{ height: "300vh" }}
    >
      {/* Aurora wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none aurora-gradient opacity-30"
      />

      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <Container className="relative grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: animated beat content */}
          <div className="lg:col-span-7 relative min-h-[420px]">
            {beats.map((beat, i) => (
              <AnimatedBeat
                key={i}
                beat={beat}
                range={beatRanges[i]}
                progress={scrollYProgress}
              />
            ))}
          </div>

          {/* Right: chapter rail */}
          <div className="lg:col-span-5 lg:justify-self-end">
            <ChapterRail progress={scrollYProgress} count={beats.length} />
          </div>
        </Container>
      </div>
    </section>
  );
}

type Beat = (typeof beats)[number];

function AnimatedBeat({
  beat,
  range,
  progress,
}: {
  beat: Beat;
  range: { start: number; mid: number; end: number };
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Smooth fade in/out: 0 at edges, 1 at mid
  const opacity = useTransform(
    progress,
    [range.start - 0.05, range.mid - 0.05, range.mid + 0.05, range.end + 0.05],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [range.start, range.mid, range.end],
    [40, 0, -40],
  );

  return (
    <m.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <Beat beat={beat} />
    </m.div>
  );
}

function Beat({ beat, static: isStatic = false }: { beat: Beat; static?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-full bg-(--color-brand-700) text-(--color-brand-100) border border-(--color-brand-500)">
          <Icon name={beat.iconName} className="w-4 h-4" variant="line" />
        </span>
        <span className="data-mono text-[11px] uppercase tracking-widest text-(--color-brand-300)">
          {beat.eyebrow}
        </span>
      </div>
      <h2 className="mt-6 font-display text-4xl lg:text-5xl leading-tight tracking-tight text-(--color-bg)">
        {beat.headline}
      </h2>
      <p className="mt-5 text-lg text-(--color-brand-100) leading-relaxed max-w-xl">
        {beat.body}
      </p>
      <div className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-baseline border-t border-(--color-brand-500)/40 pt-6 max-w-md">
        <div className="text-5xl font-display tracking-tight num-tabular text-(--color-bg)">
          {isStatic ? `${beat.stat.value}${beat.stat.suffix ?? ""}` : (
            <AnimatedNumber value={beat.stat.value} suffix={beat.stat.suffix} />
          )}
        </div>
        <div className="data-mono text-[10px] uppercase tracking-widest text-(--color-brand-300) self-end pb-2">
          {beat.stat.label}
        </div>
      </div>
    </div>
  );
}

function ChapterRail({
  progress,
  count,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  count: number;
}) {
  return (
    <div className="hidden lg:flex flex-col items-end gap-4 relative">
      {/* Track line */}
      <span aria-hidden className="absolute right-[5px] top-2 bottom-2 w-px bg-(--color-brand-500)/30" />
      {Array.from({ length: count }, (_, i) => (
        <ChapterDot key={i} index={i} count={count} progress={progress} />
      ))}
    </div>
  );
}

function ChapterDot({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const center = (index + 0.5) / count;
  const opacity = useTransform(
    progress,
    [center - 0.2, center, center + 0.2],
    [0.35, 1, 0.35],
  );
  const scale = useTransform(
    progress,
    [center - 0.15, center, center + 0.15],
    [1, 1.5, 1],
  );
  return (
    <m.div
      style={{ opacity, scale }}
      className="relative flex items-center gap-3"
    >
      <span className="data-mono text-[10px] uppercase tracking-widest text-(--color-brand-200)">
        0{index + 1}
      </span>
      <span className="w-3 h-3 rounded-full bg-(--color-bg)" />
    </m.div>
  );
}
