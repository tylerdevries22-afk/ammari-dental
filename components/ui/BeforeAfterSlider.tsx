"use client";
import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import Image from "next/image";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Aspect ratio CSS string, e.g. "4 / 3". Default "4 / 3". */
  aspect?: string;
  /** Initial divider position 0–100. Default 50. */
  initial?: number;
  className?: string;
  /** When in view for the first time, the divider auto-sweeps left→right as a "demo". */
  autoSweep?: boolean;
};

/**
 * Draggable before/after image slider.
 *
 * - Pointer drag: moves the divider in real time
 * - Keyboard: left/right arrows nudge ±5, home/end snap to ends
 * - Touch-friendly: pointer events handle finger drag identically
 * - On first viewport entry (if `autoSweep`), the divider auto-sweeps from
 *   25% → 75% over 1.4s as a hint, then locks for user control
 *
 * Each image is a separate <Image> with priority=false (no LCP risk) and
 * a descriptive alt — so the experience is screen-reader-comprehensible
 * even without seeing the slider.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  aspect = "4 / 3",
  initial = 50,
  className,
  autoSweep = true,
}: Props) {
  const { enabled } = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Auto-sweep on first viewport entry
  useEffect(() => {
    if (!enabled || !autoSweep || interacted) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || interacted) return;
        let raf = 0;
        const start = performance.now();
        const duration = 1400;
        const tick = (t: number) => {
          if (interacted) return;
          const p = Math.min(1, (t - start) / duration);
          // ease in-out cubic
          const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          // sweep 25 -> 75 -> 50
          const target =
            eased < 0.5
              ? 25 + (75 - 25) * (eased * 2)
              : 75 - (75 - 50) * ((eased - 0.5) * 2);
          setPos(target);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, autoSweep, interacted]);

  const updateFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    setInteracted(true);
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-(--radius-xl) bg-(--color-brand-900) shadow-(--shadow-soft-lg) select-none touch-none",
        className,
      )}
      style={{ aspectRatio: aspect }}
      onPointerDown={(e) => {
        setDragging(true);
        setInteracted(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        updateFromClientX(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* Before image — full width, bottom layer */}
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
      />

      {/* After image — clipped to right side via inset-clip */}
      <div
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 data-mono text-[10px] uppercase tracking-widest bg-(--surface-glass) text-(--color-brand-700) px-2.5 py-1 rounded-full backdrop-blur-sm">
        Before
      </div>
      <div className="absolute top-3 right-3 data-mono text-[10px] uppercase tracking-widest bg-(--color-brand-700) text-(--color-brand-50) px-2.5 py-1 rounded-full">
        After
      </div>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-0 bottom-0 w-px bg-(--color-brand-50) shadow-(--shadow-soft-md)" />
        <button
          type="button"
          aria-label={`Before/after divider. Currently at ${Math.round(pos)} percent. Use left and right arrow keys to adjust.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          role="slider"
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-(--color-brand-700) text-(--color-brand-50) shadow-(--shadow-soft-lg) cursor-ew-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-300) pointer-events-auto"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 6 L4 12 L8 18" />
            <path d="M16 6 L20 12 L16 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
