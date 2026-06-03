"use client";
import { useMemo } from "react";
import type { Slot } from "@/lib/booking/types";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";

type DayGroup = {
  localDate: string;
  label: string;
  slots: Slot[];
};

export function SlotGrid({
  slots,
  loading,
  value,
  onChange,
}: {
  slots: Slot[];
  loading: boolean;
  value: Slot | null;
  onChange: (slot: Slot) => void;
}) {
  const days = useMemo(() => groupByDay(slots), [slots]);

  if (loading) {
    return (
      <div className="grid gap-3" aria-busy="true" aria-live="polite">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid grid-cols-[120px_1fr] gap-3 items-start">
            <Skeleton className="h-10" />
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-10" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!days.length) {
    return (
      <div className="rounded-(--radius-lg) bg-(--color-surface-muted) p-6 text-center">
        <p className="text-(--color-ink-700)">
          No openings in the next two weeks. Call the office and we&rsquo;ll fit you in.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {days.map((d) => (
        <div
          key={d.localDate}
          className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 items-start"
        >
          <div className="pt-2.5 text-sm font-semibold text-(--color-ink-700)">
            <div className="font-display text-base text-(--color-ink-900)">
              {d.label.split(",")[0]}
            </div>
            <div className="text-xs uppercase tracking-(--tracking-wide) text-(--color-ink-500)">
              {d.label.split(",")[1]?.trim()}
            </div>
          </div>
          <div role="group" aria-label={`Available times on ${d.label}`} className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {d.slots.map((s) => {
              const selected = value?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(s)}
                  className={cn(
                    "h-10 rounded-(--radius-md) text-sm font-semibold tracking-tight transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
                    selected
                      ? "bg-(--color-brand-600) text-(--color-brand-50)"
                      : "bg-(--color-surface) border border-(--color-ink-200) text-(--color-ink-900) hover:border-(--color-brand-400)",
                  )}
                >
                  {formatTime(s.startIso)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDay(slots: Slot[]): DayGroup[] {
  const map = new Map<string, Slot[]>();
  for (const s of slots) {
    const date = s.startIso.slice(0, 10);
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(s);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, daySlots]) => ({
      localDate,
      label: new Date(`${localDate}T12:00:00Z`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: "America/Denver",
      }),
      slots: daySlots.sort((a, b) => a.startIso.localeCompare(b.startIso)),
    }));
}

function formatTime(iso: string): string {
  // Mock provider emits unsuffixed ISO; treat as Denver wall clock.
  // Real NexHealth emits suffixed ISO; both round-trip correctly here.
  const hasOffset = /[+-]\d{2}:\d{2}|Z$/.test(iso);
  const d = hasOffset ? new Date(iso) : new Date(`${iso}-06:00`);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
}
