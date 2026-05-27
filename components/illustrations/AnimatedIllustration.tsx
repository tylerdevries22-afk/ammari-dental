"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** SVG viewBox. Defaults to a square 200×200 design space. */
  viewBox?: string;
  /** ARIA label for the illustration. Empty string = treat as decorative. */
  label?: string;
};

/**
 * Shared wrapper for the service-tile illustration system.
 *
 * On scroll into view (once per illustration):
 *  - all stroked descendants animate stroke-dashoffset from 1→0 (draw-in)
 *  - all filled descendants fade opacity 0→1 with a slight scale-up
 *  - children stagger 60ms apart
 *
 * Each child path is responsible for its own d/fill/stroke — the wrapper
 * just orchestrates timing. Pure GSAP (no Framer), uses ScrollTrigger so
 * it stays in sync with Lenis.
 */
export function AnimatedIllustration({
  children,
  className,
  viewBox = "0 0 200 200",
  label,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    if (!enabled) return;
    const svg = ref.current;
    if (!svg) return;

    // Defer the initial-state prep one rAF so React's hydration completes
    // first. Without this, setting strokeDashoffset/opacity synchronously can
    // cause a momentary visual flicker if hydration is still settling.
    let rafId = 0;
    let ctx: ReturnType<typeof gsap.context> | null = null;

    rafId = requestAnimationFrame(() => {
      // Strokes: dash-offset draw-in
      const strokes = svg.querySelectorAll<SVGGeometryElement>("[data-draw]");
      strokes.forEach((el) => {
        try {
          const len = el.getTotalLength();
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        } catch {
          // getTotalLength can throw if the element isn't measurable yet
        }
      });
      // Fills: start invisible
      const fills = svg.querySelectorAll<SVGElement>("[data-fill]");
      fills.forEach((el) => {
        el.style.opacity = "0";
        el.style.transformOrigin = "center";
        el.style.transform = "scale(0.85)";
      });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: "top 85%",
            once: true,
          },
        });
        tl.to(strokes, {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.06,
        });
        tl.to(
          fills,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.4)",
            stagger: 0.05,
          },
          "-=0.55",
        );
      }, svg);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, [enabled]);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("block", className)}
    >
      {children}
    </svg>
  );
}
