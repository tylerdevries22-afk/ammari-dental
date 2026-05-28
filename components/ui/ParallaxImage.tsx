"use client";
import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

type Shape = "rounded" | "oval" | "circle";

type Props = {
  src: string;
  alt: string;
  /** Container aspect ratio CSS, e.g. "4 / 5". Ignored for shape="circle" (1/1). */
  aspect?: string;
  /**
   * Parallax travel as a fraction of a fixed base (~240px). ~0.10 is subtle,
   * ~0.16 is the default. 0 disables the drift (static frame).
   */
  speed?: number;
  /**
   * Paired images that sit side by side should use opposite directions so they
   * drift apart on scroll — the signature multi-speed parallax effect.
   */
  direction?: "normal" | "reverse";
  /** Visual shape of the frame. */
  shape?: Shape;
  /** Radius token (CSS var name) when shape="rounded". Default "--radius-2xl". */
  radius?: string;
  /** object-fit. Use "contain" for cut-out subjects on a colored panel. */
  fit?: "cover" | "contain";
  /** object-position, e.g. "bottom" for cut-out subjects. */
  position?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Scroll-parallax image frame. Mirrors the multi-speed, opposing-direction
 * parallax of editorial dental sites (a translateY driven by the element's
 * progress through the viewport) but built on framer-motion's useScroll so it
 * rides our Lenis smooth-scroll and honors the reduced-motion contract:
 * when motion is disabled the frame is fully static (no transform, no overflow).
 */
export function ParallaxImage({
  src,
  alt,
  aspect = "4 / 5",
  speed = 0.16,
  direction = "normal",
  shape = "rounded",
  radius = "--radius-2xl",
  fit = "cover",
  position,
  priority = false,
  sizes = "(max-width: 768px) 90vw, 45vw",
  className,
}: Props) {
  const { enabled } = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const amp = Math.round(Math.max(0, speed) * 240);
  const from = direction === "reverse" ? -amp : amp;
  const to = direction === "reverse" ? amp : -amp;
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  const shapeClass =
    shape === "oval" ? "rounded-[50%]" : shape === "circle" ? "rounded-full" : "";
  const aspectRatio = shape === "circle" ? "1 / 1" : aspect;
  const radiusStyle =
    shape === "rounded" ? { borderRadius: `var(${radius})` } : undefined;

  // Headroom so the parallax drift never reveals the frame edges.
  const animate = enabled && amp > 0;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-(--color-surface-muted)",
        shapeClass,
        className,
      )}
      style={{ aspectRatio, ...radiusStyle }}
    >
      <m.div
        className="absolute inset-0"
        style={{ y: animate ? y : 0, scale: animate ? 1.12 : 1 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={fit === "contain" ? "object-contain" : "object-cover"}
          style={position ? { objectPosition: position } : undefined}
        />
      </m.div>
    </div>
  );
}
