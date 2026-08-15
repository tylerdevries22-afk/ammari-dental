"use client";
import { cn } from "@/lib/cn";

export type Step = {
  id: string;
  label: string;
};

export function StepIndicator({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center gap-2 flex-wrap text-xs">
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold tracking-tight transition-colors",
                  state === "active"
                    ? "bg-(--color-brand-600) text-(--color-brand-50)"
                    : state === "done"
                      ? "bg-(--color-brand-100) text-(--color-brand-700)"
                      : "bg-(--color-surface-muted) text-(--color-ink-500)",
                )}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid place-items-center w-5 h-5 rounded-full text-[10px] font-bold",
                    state === "active"
                      ? "bg-(--color-brand-50) text-(--color-brand-700)"
                      : state === "done"
                        ? "bg-(--color-brand-600) text-(--color-brand-50)"
                        : "bg-(--color-ink-200) text-(--color-ink-500)",
                  )}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden className="text-(--color-ink-300)">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
