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
 * Two layers of motion, both pure GSAP (ScrollTrigger keeps them in sync with
 * Lenis) and both fully gated by the reduced-motion contract:
 *
 *  1. ENTRANCE (once, on scroll-in): every `[data-draw]` stroke animates its
 *     dash-offset 1→0 (draw-in) and every `[data-fill]` shape fades + scales up.
 *
 *  2. SIGNATURE LOOP (continuous, while on-screen): each scene tags one or more
 *     elements with `data-anim="<behavior>"` to give it a unique, characterful
 *     idle motion — sparkles twinkle, leaves sway, a brush scrubs, a shield
 *     beats like a pulse, etc. Loops are paused when the tile scrolls out of
 *     view (IntersectionObserver) so dozens of tiles don't burn rAF off-screen.
 *
 * Behavior vocabulary (see makeLoop): twinkle · float · bob · pulse · sway ·
 * brush · spin · ping · heartbeat. Optional `data-origin="x y"` sets a rotation
 * pivot in SVG user units; `data-seq="n"` orders a cascade.
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

    let rafId = 0;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    let io: IntersectionObserver | null = null;

    // Defer initial-state prep one rAF so React hydration settles first —
    // setting dashoffset/opacity synchronously can flicker mid-hydration.
    rafId = requestAnimationFrame(() => {
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
      const fills = svg.querySelectorAll<SVGElement>("[data-fill]");
      fills.forEach((el) => {
        el.style.opacity = "0";
        el.style.transformOrigin = "center";
        el.style.transform = "scale(0.85)";
      });

      ctx = gsap.context(() => {
        // ── Entrance ──────────────────────────────────────────────
        const tl = gsap.timeline({
          scrollTrigger: { trigger: svg, start: "top 85%", once: true },
        });
        tl.to(strokes, {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.06,
        });
        tl.to(
          fills,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", stagger: 0.05 },
          "-=0.55",
        );

        // ── Signature loops ───────────────────────────────────────
        // Scope strictly to THIS svg — an unscoped selector would match every
        // tile on the page and spawn conflicting duplicate tweens.
        const loopEls = Array.from(svg.querySelectorAll<SVGElement>("[data-anim]"));
        const loops: gsap.core.Animation[] = [];
        loopEls.forEach((el, idx) => {
          const kind = el.getAttribute("data-anim") ?? "bob";
          const origin = el.getAttribute("data-origin");
          const seqAttr = el.getAttribute("data-seq");
          const order = seqAttr != null ? parseFloat(seqAttr) : idx;
          if (origin) gsap.set(el, { svgOrigin: origin });
          else gsap.set(el, { transformOrigin: "50% 50%" });
          // Begin after the entrance, with a gentle per-element stagger.
          const delay = 1.15 + order * 0.14;
          loops.push(makeLoop(el, kind, delay));
        });

        if (loops.length) {
          loops.forEach((t) => t.pause());
          io = new IntersectionObserver(
            ([entry]) => {
              loops.forEach((t) => (entry.isIntersecting ? t.resume() : t.pause()));
            },
            { threshold: 0.12 },
          );
          io.observe(svg);
        }
      }, svg);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io?.disconnect();
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

/** Build a continuous signature loop for one element. */
function makeLoop(el: SVGElement, kind: string, delay: number): gsap.core.Animation {
  const yoyo = { repeat: -1, yoyo: true, ease: "sine.inOut", delay } as const;
  switch (kind) {
    case "twinkle":
      return gsap.to(el, { opacity: 0.25, scale: 0.55, duration: 0.7 + Math.random() * 0.5, ...yoyo });
    case "float":
      return gsap.to(el, { y: -7, duration: 1.7 + Math.random() * 0.6, ...yoyo });
    case "bob":
      return gsap.to(el, { y: -5, duration: 2.6, ...yoyo });
    case "pulse":
      return gsap.to(el, { scale: 1.16, duration: 0.9, ...yoyo });
    case "sway":
      return gsap.to(el, { rotation: 6, duration: 2.2, ...yoyo });
    case "brush":
      return gsap.to(el, { rotation: 15, duration: 0.42, ...yoyo });
    case "spin":
      return gsap.to(el, { rotation: 360, duration: 9, ease: "none", repeat: -1, delay });
    case "ping":
      return gsap.fromTo(
        el,
        { scale: 0.5, opacity: 0.55 },
        { scale: 1.9, opacity: 0, duration: 1.7, ease: "power2.out", repeat: -1, delay },
      );
    case "heartbeat": {
      const t = gsap.timeline({ repeat: -1, delay });
      t.to(el, { scale: 1.16, duration: 0.16, ease: "power2.out" })
        .to(el, { scale: 1, duration: 0.2, ease: "power2.in" })
        .to(el, { scale: 1.1, duration: 0.14, ease: "power2.out" })
        .to(el, { scale: 1, duration: 0.22, ease: "power2.in" })
        .to({}, { duration: 0.95 });
      return t;
    }
    default:
      return gsap.to(el, { y: -4, duration: 2.6, ...yoyo });
  }
}
