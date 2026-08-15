"use client";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/lib/useMotion";

/**
 * Custom cursor: a ring + dot that:
 *  - follows the pointer with spring lag (ring lags more than dot)
 *  - inflates when hovering interactive elements (links/buttons/[data-magnetic])
 *  - hides on touch devices (no fine pointer)
 *  - is removed entirely under reduced-motion
 *
 * Implementation notes:
 *  - rAF-driven transform updates; no React re-renders per frame
 *  - position synced via CSS variables on document root
 *  - pointer-events: none on both elements so it never intercepts clicks
 */
export function AmbientCursor() {
  const { enabled } = useMotion();
  const [hasFinePointer, setHasFinePointer] = useState(true);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Detect fine pointer (mouse) — skip on touch
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setHasFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || !hasFinePointer) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let dotX = x;
    let dotY = y;
    let rafId = 0;
    let scale = 1;
    let targetScale = 1;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // First-paint sync so we don't fly from center
      if (!ring.dataset.ready) {
        ringX = x;
        ringY = y;
        dotX = x;
        dotY = y;
        ring.dataset.ready = "1";
      }
      // Restore unconditionally: this used to sit inside the `ready` guard, so
      // once the pointer left the window (onLeave sets opacity 0) the cursor
      // never came back until a full reload.
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role=button], [data-cursor=grow]");
      targetScale = interactive ? 2.6 : 1;
    };

    const onLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const tick = () => {
      // Ring follows with more lag (12% per frame ~ stiff spring at 60fps)
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      // Dot tighter (45% per frame)
      dotX += (x - dotX) * 0.55;
      dotY += (y - dotY) * 0.55;
      scale += (targetScale - scale) * 0.18;

      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${scale})`;
      dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, hasFinePointer]);

  if (!enabled || !hasFinePointer) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          opacity: 0,
          willChange: "transform, opacity",
          mixBlendMode: "multiply",
        }}
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border border-(--color-brand-600)/60 z-[var(--z-cursor,70)] transition-opacity duration-300"
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{ opacity: 0, willChange: "transform, opacity" }}
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-(--color-brand-700) z-[var(--z-cursor,70)] transition-opacity duration-300"
      />
    </>
  );
}
