"use client";
import { useMemo, useState } from "react";
import type { Slot } from "@/lib/booking/types";
import { MAX_LOOKAHEAD_DAYS } from "@/lib/booking/rules";
import { cn } from "@/lib/cn";
import { CalendarMonth } from "./CalendarMonth";
import { Skeleton } from "./Skeleton";

/**
 * Two-column slot picker:
 *   - Left: CalendarMonth — pick a date.
 *   - Right: TimeColumn — slots for the picked date.
 *
 * The picked date defaults to the first available one in the loaded window.
 * Re-renders are cheap because `availableDates` and `slotsByDate` are memoized
 * off the flat slot list the API returns.
 */
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
  const { availableDates, slotsByDate } = useMemo(() => indexSlots(slots), [slots]);
  const today = useMemo(
    () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Denver" }),
    [],
  );
  const maxDate = useMemo(() => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + MAX_LOOKAHEAD_DAYS);
    return d.toISOString().slice(0, 10);
  }, [today]);

  // Picked date is derived:
  //   1. Explicit click in the calendar (manualDate)
  //   2. Date of the currently selected slot, if any (from parent)
  //   3. First available date in the loaded window
  //
  // No effects needed — the inferred values feed directly into render. When
  // the user clicks a slot the parent's `value` updates, which keeps the
  // same picked date (slot belongs to it). When the picker unmounts and
  // remounts (back/forward navigation between steps), manualDate resets
  // and the value-derived date takes over.
  const firstAvailable = useMemo(
    () => [...availableDates].sort()[0] ?? null,
    [availableDates],
  );
  const inferredFromValue = value?.startIso.slice(0, 10) ?? null;
  const [manualDate, setManualDate] = useState<string | null>(null);
  const pickedDate = manualDate ?? inferredFromValue ?? firstAvailable;

  // Visible month follows the picked date unless the user has actively
  // navigated to another month with the arrow buttons.
  const [navMonth, setNavMonth] = useState<string | null>(null);
  const monthAnchor =
    navMonth ?? (pickedDate ? firstOfMonth(pickedDate) : firstOfMonth(today));

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[1fr_minmax(0,260px)] gap-6">
        <Skeleton className="h-[360px]" />
        <div className="grid gap-2" aria-busy="true" aria-live="polite">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-11" />
          ))}
        </div>
      </div>
    );
  }

  if (!availableDates.size) {
    return (
      <div className="rounded-(--radius-lg) bg-(--color-surface-muted) p-6 text-center">
        <p className="text-(--color-ink-700)">
          No openings in the next {Math.round(MAX_LOOKAHEAD_DAYS / 7)} weeks. Call
          the office and we&rsquo;ll fit you in.
        </p>
      </div>
    );
  }

  const slotsForDate = pickedDate ? (slotsByDate.get(pickedDate) ?? []) : [];

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,260px)] gap-6">
      <CalendarMonth
        availableDates={availableDates}
        value={pickedDate}
        monthAnchor={monthAnchor}
        onChange={(date) => {
          setManualDate(date);
          setNavMonth(null);
        }}
        onMonthChange={setNavMonth}
        minDate={today}
        maxDate={maxDate}
      />
      <TimeColumn
        date={pickedDate}
        slots={slotsForDate}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function TimeColumn({
  date,
  slots,
  value,
  onChange,
}: {
  date: string | null;
  slots: Slot[];
  value: Slot | null;
  onChange: (slot: Slot) => void;
}) {
  if (!date) {
    return (
      <div
        aria-live="polite"
        className="grid place-items-center rounded-(--radius-lg) border border-dashed border-(--color-ink-200) p-6 text-center text-sm text-(--color-ink-500)"
      >
        Pick a date to see times.
      </div>
    );
  }
  const friendly = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <div className="rounded-(--radius-lg) border border-(--color-ink-200) bg-(--color-surface) p-4">
      <div className="font-display text-base text-(--color-ink-900)">{friendly}</div>
      <div className="text-xs uppercase tracking-(--tracking-wide) text-(--color-ink-500) mb-3">
        Mountain Time
      </div>
      {slots.length ? (
        <div
          role="group"
          aria-label={`Available times on ${friendly}`}
          className="grid grid-cols-2 gap-2"
        >
          {slots.map((s) => {
            const selected = value?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(s)}
                className={cn(
                  "h-10 rounded-(--radius-md) text-sm font-semibold tabular-nums transition-colors",
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
      ) : (
        <p className="text-sm text-(--color-ink-500)">
          No openings on this date. Try another.
        </p>
      )}
    </div>
  );
}

// ----- helpers -----

function indexSlots(slots: Slot[]) {
  const slotsByDate = new Map<string, Slot[]>();
  const availableDates = new Set<string>();
  for (const s of slots) {
    const day = s.startIso.slice(0, 10);
    availableDates.add(day);
    if (!slotsByDate.has(day)) slotsByDate.set(day, []);
    slotsByDate.get(day)!.push(s);
  }
  for (const list of slotsByDate.values()) {
    list.sort((a, b) => a.startIso.localeCompare(b.startIso));
  }
  return { availableDates, slotsByDate };
}

function firstOfMonth(localDate: string): string {
  return localDate.slice(0, 8) + "01";
}

function formatTime(iso: string): string {
  const hasOffset = /[+-]\d{2}:\d{2}|Z$/.test(iso);
  const d = hasOffset ? new Date(iso) : new Date(`${iso}-06:00`);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
}
