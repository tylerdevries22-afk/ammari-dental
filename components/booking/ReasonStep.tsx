"use client";
import type { Reason } from "@/lib/booking/types";
import { cn } from "@/lib/cn";

export function ReasonStep({
  reasons,
  value,
  onChange,
}: {
  reasons: Reason[];
  value: string | null;
  onChange: (reasonId: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight">
        What brings you in?
      </h2>
      <p className="mt-2 text-(--color-ink-700)">
        Pick the closest match — we&rsquo;ll route you to the right provider.
      </p>

      <div
        role="radiogroup"
        aria-label="Reason for visit"
        className="mt-6 grid sm:grid-cols-2 gap-3"
      >
        {reasons.map((r) => {
          const active = value === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(r.id)}
              className={cn(
                "text-left rounded-(--radius-lg) p-5 transition-colors border-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
                active
                  ? "bg-(--color-brand-50) border-(--color-brand-500)"
                  : "bg-(--color-surface) border-(--color-ink-200) hover:border-(--color-brand-300)",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg text-(--color-ink-900)">
                  {r.label}
                </span>
                <span className="data-mono text-[10px] text-(--color-ink-500)">
                  {r.durationMinutes} min
                </span>
              </div>
              <p className="mt-1.5 text-sm text-(--color-ink-700)">
                {r.description}
              </p>
              {r.urgent && (
                <p className="mt-2 text-xs font-semibold text-(--color-warning)">
                  Active pain? Calling is fastest.
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
