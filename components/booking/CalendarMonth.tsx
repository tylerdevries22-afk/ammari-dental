"use client";
import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { isOpenOn } from "@/lib/booking/rules";

/**
 * Month-grid calendar for the booking picker.
 *
 * Renders a familiar 6×7 grid of dates. Cells fall into one of four states:
 *   - **available**: there's at least one slot for that date (subtle brand
 *     tint, brand-text)
 *   - **selected**: currently picked date (filled brand-600)
 *   - **closed**: open-day per practice hours but no slots loaded yet
 *     (default surface; clickable to allow the user to *try* dates that
 *     might unlock when the provider filter changes)
 *   - **disabled**: weekend, holiday, past date, or outside the visible
 *     month — non-interactive, faded
 *
 * The available-dates set is computed by the caller from the slot list, so
 * the calendar doesn't need to know how to fetch availability — pure
 * presentation.
 */

type Props = {
  /** YYYY-MM-DD localdates that have at least one slot in the loaded window. */
  availableDates: ReadonlySet<string>;
  /** YYYY-MM-DD of the currently picked date (or null). */
  value: string | null;
  /** First-of-month displayed (YYYY-MM-DD), e.g. "2026-06-01". */
  monthAnchor: string;
  onChange: (localDate: string) => void;
  onMonthChange: (monthAnchor: string) => void;
  /** Hard floor — earliest date the practice can take. */
  minDate?: string;
  /** Hard ceiling — latest date in the bookable window. */
  maxDate?: string;
};

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarMonth({
  availableDates,
  value,
  monthAnchor,
  onChange,
  onMonthChange,
  minDate,
  maxDate,
}: Props) {
  const grid = useMemo(() => buildGrid(monthAnchor), [monthAnchor]);
  const monthLabel = useMemo(
    () =>
      new Date(`${monthAnchor}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [monthAnchor],
  );

  const today = todayDenver();

  function shiftMonth(delta: number) {
    const d = new Date(`${monthAnchor}T12:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() + delta);
    onMonthChange(toLocalDate(d).slice(0, 8) + "01");
  }

  return (
    <div className="rounded-(--radius-lg) border border-(--color-ink-200) bg-(--color-surface) p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="grid place-items-center w-9 h-9 rounded-full text-(--color-ink-700) hover:bg-(--color-brand-50) hover:text-(--color-brand-700) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <div
          className="font-display text-lg tracking-tight text-(--color-ink-900)"
          aria-live="polite"
        >
          {monthLabel}
        </div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="grid place-items-center w-9 h-9 rounded-full text-(--color-ink-700) hover:bg-(--color-brand-50) hover:text-(--color-brand-700) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <div
        role="grid"
        aria-label={`Available dates in ${monthLabel}`}
        className="mt-4"
      >
        <div role="row" className="grid grid-cols-7 mb-1">
          {WEEKDAY_LABELS.map((d, i) => (
            <div
              key={i}
              role="columnheader"
              className="text-center text-[10px] uppercase tracking-(--tracking-widest) text-(--color-ink-500) py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div role="rowgroup" className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) {
              return <div key={i} role="gridcell" aria-hidden />;
            }
            const beforeMin = minDate ? cell.iso < minDate : false;
            const afterMax = maxDate ? cell.iso > maxDate : false;
            const inPast = cell.iso < today;
            const closed = !isOpenOn(cell.iso);
            const disabled = beforeMin || afterMax || inPast || closed;
            const available = !disabled && availableDates.has(cell.iso);
            const selected = value === cell.iso;
            return (
              <button
                key={i}
                role="gridcell"
                type="button"
                disabled={disabled}
                aria-selected={selected}
                aria-label={describeDate(cell.iso, {
                  available,
                  closed,
                  inPast,
                })}
                onClick={() => onChange(cell.iso)}
                className={cn(
                  "h-10 sm:h-11 rounded-(--radius-md) text-sm font-semibold tabular-nums transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
                  selected
                    ? "bg-(--color-brand-600) text-(--color-brand-50)"
                    : available
                      ? "bg-(--color-brand-50) text-(--color-brand-700) hover:bg-(--color-brand-100)"
                      : disabled
                        ? "text-(--color-ink-300) cursor-not-allowed"
                        : "text-(--color-ink-700) hover:bg-(--color-surface-muted)",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-(--color-ink-500)">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block w-3 h-3 rounded-(--radius-sm) bg-(--color-brand-50) border border-(--color-brand-300)"
          />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block w-3 h-3 rounded-(--radius-sm) bg-(--color-brand-600)"
          />
          Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block w-3 h-3 rounded-(--radius-sm) bg-(--color-surface-muted)" />
          Closed
        </span>
      </div>
    </div>
  );
}

// ----- helpers -----

type Cell = { iso: string; day: number } | null;

function buildGrid(monthAnchor: string): Cell[] {
  const first = new Date(`${monthAnchor}T12:00:00Z`);
  const year = first.getUTCFullYear();
  const month = first.getUTCMonth();
  const startDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: Cell[] = [];
  for (let i = 0; i < startDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${year}-${pad(month + 1)}-${pad(d)}`;
    cells.push({ iso, day: d });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  // Ensure 6 rows for visual stability.
  while (cells.length < 42) cells.push(null);
  return cells;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toLocalDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayDenver(): string {
  // YYYY-MM-DD as observed in America/Denver.
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}

function describeDate(
  iso: string,
  flags: { available: boolean; closed: boolean; inPast: boolean },
): string {
  const friendly = new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  if (flags.inPast) return `${friendly} — in the past`;
  if (flags.closed) return `${friendly} — office closed`;
  if (flags.available) return `${friendly} — openings available`;
  return `${friendly} — check availability`;
}
