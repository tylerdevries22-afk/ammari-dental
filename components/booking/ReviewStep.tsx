"use client";
import { useState } from "react";
import type { PatientInfo, Reason, Provider, Slot } from "@/lib/booking/types";

export function ReviewStep({
  reason,
  provider,
  slot,
  patient,
  submitting,
  error,
  onConfirm,
}: {
  reason: Reason;
  provider: Provider;
  slot: Slot;
  patient: PatientInfo;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
}) {
  const [ack, setAck] = useState(false);
  const time = formatRange(slot.startIso, slot.endIso);

  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight">
        One quick review.
      </h2>

      <dl className="mt-6 grid sm:grid-cols-2 gap-4 rounded-(--radius-lg) bg-(--color-surface-muted) p-5">
        <Row label="When" value={time} />
        <Row label="With" value={provider.name} />
        <Row label="Reason" value={reason.label} />
        <Row label="Patient" value={`${patient.firstName} ${patient.lastName}`} />
        <Row label="Email" value={patient.email} />
        <Row label="Phone" value={patient.phone} />
      </dl>

      <div className="mt-6 rounded-(--radius-lg) bg-(--color-surface) border border-(--color-brand-100) p-5">
        <label className="flex items-start gap-3 text-sm text-(--color-ink-700)">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-1 w-4 h-4 accent-(--color-brand-600)"
            aria-describedby="hipaa-copy"
          />
          <span id="hipaa-copy">
            I understand this booking confirms a clinical appointment. This page is
            not for sharing protected health information beyond what&rsquo;s
            requested. See our{" "}
            <a href="/privacy" className="underline text-(--color-brand-700)">
              privacy policy
            </a>
            .
          </span>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-(--radius-md) bg-(--color-danger)/10 text-(--color-danger) text-sm px-4 py-3"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!ack || submitting}
        onClick={onConfirm}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) shadow-(--shadow-soft-md) transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2"
      >
        {submitting ? "Booking…" : "Confirm appointment"}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-(--tracking-wide) text-(--color-ink-500)">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-(--color-ink-900)">{value}</dd>
    </div>
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
