"use client";
import { useRef, type ReactNode } from "react";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  baseSpeed?: number;
  reverse?: boolean;
};

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export function VelocityMarquee({ children, className, baseSpeed = 0.6, reverse = false }: Props) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Faster-settling spring — settles in ~8 frames instead of ~30
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1500], [0, 4], { clamp: false });

  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = direction.current * baseSpeed * (delta / 16);
    if (velocityFactor.get() < 0) direction.current = reverse ? 1 : -1;
    else if (velocityFactor.get() > 0) direction.current = reverse ? -1 : 1;
    moveBy += direction.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  if (reduced) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <div className="flex gap-12 whitespace-nowrap">
          <span className="flex gap-12 shrink-0">{children}</span>
          <span className="flex gap-12 shrink-0" aria-hidden>{children}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <m.div
        ref={trackRef}
        style={{ x, willChange: "transform" }}
        className="flex gap-12 whitespace-nowrap"
      >
        <span className="flex gap-12 shrink-0">{children}</span>
        <span className="flex gap-12 shrink-0" aria-hidden>{children}</span>
        <span className="flex gap-12 shrink-0" aria-hidden>{children}</span>
        <span className="flex gap-12 shrink-0" aria-hidden>{children}</span>
      </m.div>
    </div>
  );
}
