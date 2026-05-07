"use client";
import { useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const APPT_LENGTH_MIN = 30;

type Hours = (typeof site.hours)[number];

function getDayHours(date: Date): Hours | undefined {
  const name = FULL_DAY_NAMES[date.getDay()];
  return site.hours.find((h) => h.day === name);
}

function isOpen(date: Date): boolean {
  const h = getDayHours(date);
  if (!h) return false;
  return !("closed" in h && h.closed);
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseHHMM(s: string): [number, number] {
  const [h, m] = s.split(":").map((n) => parseInt(n, 10));
  return [h, m];
}

function generateSlots(date: Date): string[] {
  const h = getDayHours(date);
  if (!h) return [];
  const open = (h as { open?: string }).open;
  const close = (h as { close?: string }).close;
  if (!open || !close) return [];
  const [oH, oM] = parseHHMM(open);
  const [cH, cM] = parseHHMM(close);

  const start = oH * 60 + oM;
  const end = cH * 60 + cM - APPT_LENGTH_MIN;

  const slots: string[] = [];
  for (let t = start; t <= end; t += APPT_LENGTH_MIN) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    slots.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }

  // Drop slots in the past for today
  const now = new Date();
  if (isSameDate(date, now)) {
    const cutoff = now.getHours() * 60 + now.getMinutes();
    return slots.filter((s) => {
      const [sh, sm] = parseHHMM(s);
      return sh * 60 + sm > cutoff + 60; // require >= 1h notice
    });
  }
  return slots;
}

function formatTimeLabel(time24: string): string {
  const [h, m] = parseHHMM(time24);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export type BookingValue = { date: string; time: string } | null;

export function BookingCalendar({
  value,
  onChange,
}: {
  value: BookingValue;
  onChange: (v: BookingValue) => void;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);

  const initialDate = value
    ? new Date(`${value.date}T00:00:00`)
    : today;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selected, setSelected] = useState<Date | null>(value ? initialDate : null);

  const cells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const slots = useMemo(
    () => (selected ? generateSlots(selected) : []),
    [selected]
  );

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  }

  const canPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());
  const canNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  function selectDate(d: Date) {
    setSelected(d);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (value && value.date === dateStr) return;
    onChange({ date: dateStr, time: "" });
  }

  function selectTime(t: string) {
    if (!selected) return;
    const dateStr = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;
    onChange({ date: dateStr, time: t });
  }

  return (
    <div className="rounded-2xl border border-(--color-brand-100) bg-white overflow-hidden">
      <div className="grid md:grid-cols-[1fr_auto_minmax(200px,1fr)]">
        {/* Calendar */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              disabled={!canPrev}
              aria-label="Previous month"
              className="grid place-items-center w-9 h-9 rounded-full hover:bg-(--color-brand-50) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Chev dir="left" />
            </button>
            <div className="font-display text-lg">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              disabled={!canNext}
              aria-label="Next month"
              className="grid place-items-center w-9 h-9 rounded-full hover:bg-(--color-brand-50) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Chev dir="right" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[11px] uppercase tracking-wider text-(--color-ink-500) text-center font-semibold mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={`e-${i}`} />;
              const inPast = d < today;
              const tooFar = d > maxDate;
              const open = isOpen(d);
              const disabled = inPast || tooFar || !open;
              const isSelected = selected && isSameDate(d, selected);
              const isToday = isSameDate(d, today);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(d)}
                  aria-pressed={!!isSelected}
                  className={cn(
                    "relative h-10 rounded-lg text-sm font-medium transition-all",
                    disabled
                      ? "text-(--color-ink-300) cursor-not-allowed"
                      : "text-(--color-ink-900) hover:bg-(--color-brand-50)",
                    isSelected &&
                      "bg-(--color-brand-600) text-white hover:bg-(--color-brand-700)",
                    !isSelected && isToday && "ring-1 ring-(--color-brand-300)"
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block w-px bg-(--color-brand-100)" />
        <div className="md:hidden h-px bg-(--color-brand-100) mx-5" />

        {/* Time slots */}
        <div className="p-5">
          <div className="mb-3">
            <div className="text-[11px] uppercase tracking-widest font-bold text-(--color-brand-600)">
              {selected
                ? `${MONTH_NAMES[selected.getMonth()].slice(0, 3)} ${selected.getDate()}`
                : "Select a date"}
            </div>
            <div className="text-sm text-(--color-ink-500) mt-0.5">
              {selected
                ? slots.length > 0
                  ? `${slots.length} times available`
                  : "No times available"
                : "Pick a day on the calendar"}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selected && (
              <m.div
                key={selected.toISOString()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="max-h-[280px] overflow-y-auto pr-1 grid grid-cols-2 gap-2"
              >
                {slots.length === 0 ? (
                  <p className="col-span-2 text-sm text-(--color-ink-500)">
                    Please pick another day or call {site.phone}.
                  </p>
                ) : (
                  slots.map((t) => {
                    const isSelected = value?.time === t && selected;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => selectTime(t)}
                        aria-pressed={!!isSelected}
                        className={cn(
                          "h-10 rounded-lg text-sm font-medium transition-colors border",
                          isSelected
                            ? "bg-(--color-brand-600) border-(--color-brand-600) text-white"
                            : "bg-white border-(--color-brand-200) text-(--color-ink-900) hover:border-(--color-brand-400) hover:bg-(--color-brand-50)"
                        )}
                      >
                        {formatTimeLabel(t)}
                      </button>
                    );
                  })
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Chev({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
