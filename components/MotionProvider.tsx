"use client";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  // framer-motion defaults to reducedMotion:"never". The globals.css rules only
  // neutralize CSS animations, so without this every JS-driven transform still
  // played for users who asked for reduced motion.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
