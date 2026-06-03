"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, m } from "framer-motion";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";
import { getBookingMode } from "@/lib/booking/flag";

/**
 * Unified booking surface: a segmented toggle above either the live calendar
 * picker or the legacy "request a callback" form. Defaults to the calendar.
 *
 * Dropped into every page that used to render `<AppointmentForm />` alone, so
 * the homepage, /contact, and /appointment all expose the same choice. When
 * the booking flag is "off" the toggle is hidden and the legacy form is the
 * only path — same surface, gracefully degraded.
 */

type Mode = "book" | "request";

// Both panels are heavy ("use client", react-hook-form / framer-motion /
// internal state machine). Deferring keeps homepage TTI low; the inactive
// panel's chunk is fetched lazily on first toggle.
const BookingPicker = dynamic(() =>
  import("@/components/booking/BookingPicker").then((m) => m.BookingPicker),
);
const AppointmentForm = dynamic(() =>
  import("@/components/sections/AppointmentForm").then((m) => m.AppointmentForm),
);

export function BookOrRequest({
  defaultMode = "book",
  className,
}: {
  defaultMode?: Mode;
  className?: string;
}) {
  const flag = getBookingMode();
  const bookingEnabled = flag !== "off";
  const [active, setActive] = useState<Mode>(
    bookingEnabled ? defaultMode : "request",
  );
  const { enabled: motionEnabled } = useMotion();

  if (!bookingEnabled) {
    // Picker fully disabled — no toggle, legacy form only.
    return <AppointmentForm />;
  }

  return (
    <div className={className}>
      <ModeToggle value={active} onChange={setActive} />
      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            initial={motionEnabled ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionEnabled ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === "book" ? <BookingPicker /> : <AppointmentForm />}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModeToggle({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Booking mode"
      className="inline-flex p-1 rounded-(--radius-pill) bg-(--color-surface-muted) border border-(--color-ink-200)"
    >
      <TabButton
        active={value === "book"}
        onClick={() => onChange("book")}
        controls="booking-picker-panel"
        icon={<CalendarGlyph />}
      >
        Book a time
      </TabButton>
      <TabButton
        active={value === "request"}
        onClick={() => onChange("request")}
        controls="appointment-form-panel"
        icon={<MailGlyph />}
      >
        Request a callback
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  controls,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  controls: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-4 rounded-(--radius-pill) text-sm font-semibold tracking-tight transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
        active
          ? "bg-(--color-surface) text-(--color-brand-700) shadow-(--shadow-soft-sm)"
          : "text-(--color-ink-700) hover:text-(--color-brand-700)",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function CalendarGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
