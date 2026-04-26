"use client";
import { useRef, type ReactNode } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  glare?: boolean;
  max?: number;
};

export function TiltCard({ children, className, glare = true, max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 240, damping: 24 });
  const sy = useSpring(py, { stiffness: 240, damping: 24 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare && (
        <m.div
          aria-hidden
          style={
            {
              background: `radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.55), transparent 55%)`,
              "--gx": glareX,
              "--gy": glareY,
            } as React.CSSProperties
          }
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </m.div>
  );
}
