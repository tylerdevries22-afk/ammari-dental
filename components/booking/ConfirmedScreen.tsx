"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { site } from "@/lib/site";
import { useMotion } from "@/lib/useMotion";
import type { BookingConfirmation } from "@/lib/booking/types";

export function ConfirmedScreen({ confirmation }: { confirmation: BookingConfirmation }) {
  const { enabled } = useMotion();
  const when = formatRange(confirmation.startIso, confirmation.endIso);
  const icsHref = `/api/booking/ics/${confirmation.bookingId}/${confirmation.manageToken}`;

  return (
    <m.div
      initial={enabled ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="text-center py-6"
    >
      <m.div
        initial={enabled ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
        className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-(--color-success)/15 text-(--color-success)"
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <m.path
            d="m5 12 5 5L20 7"
            initial={enabled ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </svg>
      </m.div>
      <h3 className="mt-6 text-2xl font-display tracking-tight">You&rsquo;re booked.</h3>
      <p className="mt-3 text-(--color-ink-700) max-w-md mx-auto">
        <strong>{when}</strong>
        <br />
        with {confirmation.providerName} for {confirmation.reasonLabel.toLowerCase()}.
      </p>
      <p className="mt-2 text-sm text-(--color-ink-500)">
        Confirmation sent to your email. Need to change? Call{" "}
        <a href={`tel:${site.phoneTel}`} className="text-(--color-brand-700) font-semibold">
          {site.phone}
        </a>
        .
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={icsHref}
          className="inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold border border-(--color-ink-300) text-(--color-ink-900) hover:border-(--color-brand-400) hover:text-(--color-brand-700) transition-colors"
        >
          Add to calendar
        </a>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) transition-colors"
        >
          Back to home
        </Link>
      </div>
    </m.div>
  );
}

function formatRange(startIso: string, endIso: string): string {
  const hasOffset = (s: string) => /[+-]\d{2}:\d{2}|Z$/.test(s);
  const s = hasOffset(startIso) ? new Date(startIso) : new Date(`${startIso}-06:00`);
  const e = hasOffset(endIso) ? new Date(endIso) : new Date(`${endIso}-06:00`);
  const date = s.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Denver",
  });
  const start = s.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
  const end = e.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
  return `${date} · ${start} – ${end} MT`;
}
