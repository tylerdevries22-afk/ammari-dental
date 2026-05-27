"use client";
import { useEffect, useRef } from "react";
import { useMotion } from "@/lib/useMotion";

/**
 * Subtle scroll-driven hue overlay. Sits fixed behind the body content
 * (z-index < everything), pointer-events: none. As the user scrolls
 * through the page the gradient drifts:
 *   - 0%   → faint brand-50 (cool teal cream, matches hero)
 *   - 50%  → surface-warm (warmer cream)
 *   - 100% → sage-100 cool-down (light green tea)
 *
 * Effect is very subtle (~6% opacity max) — meant to be felt, not seen.
 * Reduced-motion: returns null entirely.
 */
export function ScrollHueShift() {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      targetRef.current = Math.min(1, Math.max(0, p));
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    const tick = () => {
      rafRef.current = null;
      currentRef.current += (targetRef.current - currentRef.current) * 0.1;
      el.style.setProperty("--hue-progress", String(currentRef.current));
      if (Math.abs(targetRef.current - currentRef.current) > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        // Three-stop gradient — opacity ramps with --hue-progress
        background: `
          radial-gradient(60% 50% at 50% 0%, var(--color-brand-50) 0%, transparent 60%),
          radial-gradient(70% 60% at 50% 50%, var(--color-surface-warm) 0%, transparent 70%),
          radial-gradient(60% 50% at 50% 100%, var(--color-sage-100) 0%, transparent 60%)
        `,
        opacity: "calc(0.5 + var(--hue-progress, 0) * 0.3)",
        mixBlendMode: "multiply",
      }}
      className="fixed inset-0 -z-20 pointer-events-none transition-opacity duration-300"
    />
  );
}
