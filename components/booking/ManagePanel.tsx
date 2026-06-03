"use client";
import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export function ManagePanel({ token, valid }: { token: string; valid: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "cancelled" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch(`/api/booking/cancel/${token}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(
          data.error === "INVALID_TOKEN"
            ? "This link is no longer valid."
            : "We couldn't cancel that. Please call us.",
        );
        return;
      }
      setStatus("cancelled");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call us.");
    }
  }

  if (!valid) {
    return (
      <div className="rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100) p-8 lg:p-10 text-center">
        <p className="text-(--color-ink-700)">
          For changes, call{" "}
          <a
            href={`tel:${site.phoneTel}`}
            className="font-semibold text-(--color-brand-700)"
          >
            {site.phone}
          </a>
          .
        </p>
        <Link
          href="/appointment"
          className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) transition-colors"
        >
          Book a new appointment
        </Link>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100) p-8 lg:p-10 text-center">
        <h2 className="font-display text-2xl tracking-tight">Appointment cancelled.</h2>
        <p className="mt-3 text-(--color-ink-700)">
          We&rsquo;ll free that slot for someone else. Hope to see you soon.
        </p>
        <Link
          href="/appointment"
          className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) transition-colors"
        >
          Book a new appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100) p-8 lg:p-10">
      <h2 className="font-display text-2xl tracking-tight">Need to change plans?</h2>
      <p className="mt-3 text-(--color-ink-700)">
        Use the buttons below — or call us at{" "}
        <a
          href={`tel:${site.phoneTel}`}
          className="font-semibold text-(--color-brand-700)"
        >
          {site.phone}
        </a>{" "}
        to reschedule.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-(--radius-md) bg-(--color-danger)/10 text-(--color-danger) text-sm px-4 py-3"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`tel:${site.phoneTel}`}
          className="inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) transition-colors"
        >
          Call to reschedule
        </Link>
        <button
          type="button"
          onClick={cancel}
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold border border-(--color-danger)/40 text-(--color-danger) hover:bg-(--color-danger)/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-danger)/60 focus-visible:ring-offset-2"
        >
          {status === "submitting" ? "Cancelling…" : "Cancel appointment"}
        </button>
      </div>
    </div>
  );
}
