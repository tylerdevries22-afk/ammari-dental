"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { appointmentSchema, type AppointmentInput } from "@/lib/appointment";

type FormData = AppointmentInput;

export function AppointmentForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(appointmentSchema) });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // fetch only rejects on network failure, so a bad status must be
      // checked explicitly — otherwise a lost lead looks like a success.
      if (!res.ok) throw new Error(`appointment responded ${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError(
        `We couldn't submit your request. Please call us at ${site.phone} and we'll get you scheduled.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100)", compact ? "p-6" : "p-8 lg:p-12")}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <m.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="text-center py-8"
          >
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
              className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-(--color-success)/15 text-(--color-success)"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <m.path
                  d="m5 12 5 5L20 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </svg>
            </m.div>
            <h3 className="mt-6 text-2xl font-display">Thank you!</h3>
            <p className="mt-3 text-(--color-ink-700) max-w-md mx-auto">
              We&rsquo;ve received your request. Our team will reach out shortly to
              confirm your appointment. For urgent needs please call{" "}
              <a href={`tel:${site.phoneTel}`} className="text-(--color-brand-700) font-semibold">
                {site.phone}
              </a>
              .
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-5"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register("name")} type="text" autoComplete="name" />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register("phone")} type="tel" autoComplete="tel" />
              </Field>
            </div>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" autoComplete="email" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Preferred date" optional>
                <input {...register("preferredDate")} type="date" />
              </Field>
              <Field label="Insurance carrier" optional>
                <select {...register("insurance")} defaultValue="">
                  <option value="">Select…</option>
                  {site.insurances.map((i) => (
                    <option key={i.slug} value={i.name}>{i.name}</option>
                  ))}
                  <option value="other">Other / Self-pay</option>
                </select>
              </Field>
            </div>
            <Field label="Reason for visit" optional>
              <select {...register("reason")} defaultValue="">
                <option value="">Select…</option>
                <option>New patient exam &amp; cleaning</option>
                <option>Routine cleaning</option>
                <option>Tooth pain / emergency</option>
                <option>Cosmetic consultation</option>
                <option>Implant consultation</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Additional notes" optional>
              <textarea {...register("notes")} rows={3} />
            </Field>
            <input type="text" tabIndex={-1} aria-hidden className="hidden" {...register("website")} />

            <label className="flex items-start gap-3 text-sm text-(--color-ink-700)">
              <input
                {...register("hipaa")}
                type="checkbox"
                className="mt-1 w-4 h-4 accent-(--color-brand-600)"
              />
              <span>
                I understand this form is for appointment requests only and is not for sharing protected health information. View our{" "}
                <a href="/privacy" className="underline text-(--color-brand-700)">privacy policy</a>.
              </span>
            </label>
            {errors.hipaa && <p className="text-xs text-(--color-danger)">{errors.hipaa.message}</p>}

            <Button size="lg" iconEnd={<Icon name="arrow" className="w-4 h-4" />} disabled={submitting}>
              {submitting ? "Sending…" : "Request Appointment"}
            </Button>

            {submitError && (
              <p
                role="alert"
                className="text-sm text-(--color-danger) text-center"
              >
                {submitError}
              </p>
            )}

            <p className="text-xs text-(--color-ink-500) text-center">
              Or call us directly at{" "}
              <a href={`tel:${site.phoneTel}`} className="text-(--color-brand-700) font-semibold">
                {site.phone}
              </a>
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-(--color-ink-700) mb-1.5">
        {label} {optional && <span className="text-(--color-ink-500) font-normal">(optional)</span>}
      </span>
      <div className="[&_input]:w-full [&_select]:w-full [&_textarea]:w-full [&_input]:h-11 [&_select]:h-11 [&_input]:px-4 [&_select]:px-4 [&_textarea]:px-4 [&_textarea]:py-3 [&_input]:rounded-xl [&_select]:rounded-xl [&_textarea]:rounded-xl [&_input]:bg-(--color-surface-muted) [&_select]:bg-(--color-surface-muted) [&_textarea]:bg-(--color-surface-muted) [&_input]:border [&_select]:border [&_textarea]:border [&_input]:border-transparent [&_select]:border-transparent [&_textarea]:border-transparent focus-within:[&_input]:border-(--color-brand-400) focus-within:[&_select]:border-(--color-brand-400) focus-within:[&_textarea]:border-(--color-brand-400) [&_input]:transition-colors [&_select]:transition-colors [&_textarea]:transition-colors">
        {children}
      </div>
      {error && <span className="block text-xs text-(--color-danger) mt-1">{error}</span>}
    </label>
  );
}
