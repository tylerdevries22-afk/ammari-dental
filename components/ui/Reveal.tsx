"use client";
import { m, type Variants } from "framer-motion";
import { fadeUp, reveal } from "@/lib/motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "li";
  delay?: number;
};

export function Reveal({ children, variants = fadeUp, className, as = "div", delay = 0 }: Props) {
  const Comp = m[as];
  return (
    <Comp
      variants={variants}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </Comp>
  );
}
