"use client";
import { useInView, useMotionValue, useSpring, useTransform, m } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedNumber({
  value,
  duration = 1.4,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <m.span>{display}</m.span>
      {suffix}
    </span>
  );
}
