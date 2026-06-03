"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";

/**
 * Lenis smooth scroll, synchronized with GSAP ScrollTrigger.
 *
 * Sync model:
 *  - Lenis owns the scroll position; GSAP reads `window.scrollY` indirectly via
 *    ScrollTrigger, which we tell to `update()` on every Lenis tick.
 *  - We let Lenis drive its own RAF — calling `gsap.ticker.lagSmoothing(0)`
 *    prevents GSAP from clamping deltas (which would desync at low fps).
 *  - On reduced-motion: Lenis is not instantiated at all; native scroll wins.
 */
export function SmoothScroll() {
  const { enabled } = useMotion();

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // Letting Lenis drive transforms during scroll is what gives the
      // buttery feel — but ScrollTrigger needs to learn about every tick.
    });

    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
}
