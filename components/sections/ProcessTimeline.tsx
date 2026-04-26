"use client";
import { m } from "framer-motion";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function ProcessTimeline({
  steps,
  title = "How It Works",
}: {
  steps: { title: string; body: string }[];
  title?: string;
}) {
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-10">{title}</h2>
      <m.ol
        variants={stagger(0.08)}
        initial={reveal.initial}
        whileInView={reveal.whileInView}
        viewport={reveal.viewport}
        className="relative grid gap-8"
      >
        <div className="absolute left-6 top-3 bottom-3 w-px bg-(--color-brand-100)" aria-hidden />
        {steps.map((s, i) => (
          <m.li key={s.title} variants={fadeUp} className="relative pl-16">
            <span className="absolute left-0 top-0 grid place-items-center w-12 h-12 rounded-full bg-(--color-brand-600) text-white font-display text-lg shadow-(--shadow-soft-md)">
              {i + 1}
            </span>
            <h3 className="text-xl font-display text-(--color-ink-900)">{s.title}</h3>
            <p className="mt-2 text-(--color-ink-700)">{s.body}</p>
          </m.li>
        ))}
      </m.ol>
    </div>
  );
}
