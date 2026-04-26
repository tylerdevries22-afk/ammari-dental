"use client";
import { m } from "framer-motion";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  level = 2,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const Tag = `h${level}` as const;
  return (
    <m.div
      variants={stagger(0.08)}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <m.div variants={fadeUp} className="eyebrow mb-4">
          {eyebrow}
        </m.div>
      )}
      <m.div variants={fadeUp}>
        <Tag className="text-[clamp(28px,4vw,49px)] leading-[1.05]">{title}</Tag>
      </m.div>
      {description && (
        <m.p
          variants={fadeUp}
          className="mt-5 text-lg text-[--color-ink-700] leading-relaxed"
        >
          {description}
        </m.p>
      )}
    </m.div>
  );
}
