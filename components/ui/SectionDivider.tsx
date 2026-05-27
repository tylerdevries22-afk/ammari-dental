"use client";
import { m, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

type Variant = "wave" | "blob" | "arc" | "scallop";
type Position = "top" | "bottom";

// Two morph keyframes per variant. The path morphs between them as the
// divider scrolls through the viewport, giving the boundary a sense of
// living material rather than a hard cut.
const variants: Record<
  Variant,
  { from: string; to: string; viewBox: string; height: number }
> = {
  wave: {
    viewBox: "0 0 1440 80",
    height: 80,
    from: "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
    to:   "M0,40 C240,0  480,80 720,40 C960,0  1200,80 1440,40 L1440,80 L0,80 Z",
  },
  blob: {
    viewBox: "0 0 1440 120",
    height: 120,
    from: "M0,60 C300,120 540,30 720,70 C900,110 1140,40 1440,80 L1440,120 L0,120 Z",
    to:   "M0,80 C300,20  540,100 720,50 C900,0  1140,90 1440,50 L1440,120 L0,120 Z",
  },
  arc: {
    viewBox: "0 0 1440 100",
    height: 100,
    from: "M0,100 Q720,0 1440,100 L1440,100 L0,100 Z",
    to:   "M0,100 Q720,40 1440,100 L1440,100 L0,100 Z",
  },
  scallop: {
    viewBox: "0 0 1440 60",
    height: 60,
    from: "M0,30 Q90,60 180,30 T360,30 T540,30 T720,30 T900,30 T1080,30 T1260,30 T1440,30 L1440,60 L0,60 Z",
    to:   "M0,30 Q90,0  180,30 T360,30 T540,30 T720,30 T900,30 T1080,30 T1260,30 T1440,30 L1440,60 L0,60 Z",
  },
};

type Props = {
  variant: Variant;
  /** Whether this divider sits at the top or bottom of the next section. */
  position?: Position;
  /** Token reference for the fill — should match the next/previous section's bg. */
  fillToken?: string;
  className?: string;
};

/**
 * Morphing SVG curve divider between sections. Behavior:
 *  - Path interpolates between two keyframes as the divider scrolls through
 *    the viewport (top→middle→bottom maps to from→to→from).
 *  - Under reduced-motion: static "from" path, no animation.
 *  - 100% pointer-events: none so it never interferes with scroll/clicks.
 *
 * Token-driven fill: pass `fillToken` so the divider blends seamlessly with
 * the section that follows. Defaults to `--color-bg`.
 */
export function SectionDivider({
  variant,
  position = "bottom",
  fillToken = "--color-bg",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const spec = variants[variant];

  // Morph by interpolating a NUMERIC weight (0..1..0 across scroll), then
  // sample a discrete d each tick. Framer's useTransform on string keyframes
  // doesn't interpolate SVG paths reliably across all environments, so we
  // run the interpolation ourselves with a state setter.
  const weight = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const [d, setD] = useState(spec.from);
  useMotionValueEvent(weight, "change", (w) => {
    setD(interpolatePath(spec.from, spec.to, w));
  });

  const flip = position === "top" ? "rotate-180" : "";

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("relative w-full pointer-events-none -my-px", flip, className)}
      style={{ height: spec.height }}
    >
      <svg
        viewBox={spec.viewBox}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        className="block"
      >
        {enabled ? (
          <m.path d={d} fill={`var(${fillToken})`} />
        ) : (
          <path d={spec.from} fill={`var(${fillToken})`} />
        )}
      </svg>
    </div>
  );
}

/**
 * Interpolate between two SVG path d-strings that share an identical command
 * sequence — every numeric coordinate is linearly mixed. Falls back to the
 * "from" string if the two paths diverge structurally.
 */
function interpolatePath(from: string, to: string, t: number): string {
  // Tokenize: keep letters as anchors, parse numbers between.
  const reNum = /-?\d+(?:\.\d+)?/g;
  const fromNums = from.match(reNum);
  const toNums = to.match(reNum);
  if (!fromNums || !toNums || fromNums.length !== toNums.length) return from;
  let i = 0;
  return from.replace(reNum, () => {
    const a = parseFloat(fromNums[i]);
    const b = parseFloat(toNums[i]);
    i++;
    return String(+(a + (b - a) * t).toFixed(2));
  });
}
