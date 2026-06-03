"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import type { PatientInfo } from "@/lib/booking/types";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth"),
  isNewPatient: z.boolean(),
  insuranceCarrier: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

export function PatientInfoStep({
  defaultIsNewPatient,
  initial,
  onSubmit,
}: {
  defaultIsNewPatient: boolean;
  initial: Partial<PatientInfo> | null;
  onSubmit: (data: PatientInfo) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      dob: initial?.dob ?? "",
      isNewPatient: initial?.isNewPatient ?? defaultIsNewPatient,
      insuranceCarrier: initial?.insuranceCarrier ?? "",
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form
      id="booking-patient-info-form"
      onSubmit={handleSubmit((d) => onSubmit(d))}
      className="grid gap-5"
      noValidate
    >
      <h2 className="font-display text-2xl tracking-tight">Tell us about you</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="First name" error={errors.firstName?.message}>
          <input {...register("firstName")} type="text" autoComplete="given-name" />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName")} type="text" autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} type="tel" autoComplete="tel" />
        </Field>
        <Field label="Date of birth" error={errors.dob?.message}>
          <input {...register("dob")} type="date" autoComplete="bday" />
        </Field>
      </div>

      <fieldset className="rounded-(--radius-lg) bg-(--color-surface-muted) p-4">
        <legend className="text-xs font-semibold uppercase tracking-(--tracking-wide) text-(--color-ink-500) px-2">
          Are you a new patient?
        </legend>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <RadioOption {...register("isNewPatient", { setValueAs: (v) => v === "true" })} value="true" label="New to the practice" />
          <RadioOption {...register("isNewPatient", { setValueAs: (v) => v === "true" })} value="false" label="Returning patient" />
        </div>
      </fieldset>

      <Field label="Insurance carrier" optional>
        <select {...register("insuranceCarrier")} defaultValue="">
          <option value="">Select…</option>
          {site.insurances.map((i) => (
            <option key={i.slug} value={i.name}>
              {i.name}
            </option>
          ))}
          <option value="other">Other / Self-pay</option>
        </select>
      </Field>

      <Field label="Anything we should know?" optional>
        <textarea {...register("notes")} rows={3} placeholder="e.g. tooth sensitivity, anxious about needles" />
      </Field>
    </form>
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
      <div
        className={cn(
          "[&_input]:w-full [&_select]:w-full [&_textarea]:w-full",
          "[&_input]:h-11 [&_select]:h-11 [&_input]:px-4 [&_select]:px-4",
          "[&_textarea]:px-4 [&_textarea]:py-3",
          "[&_input]:rounded-xl [&_select]:rounded-xl [&_textarea]:rounded-xl",
          "[&_input]:bg-(--color-surface) [&_select]:bg-(--color-surface) [&_textarea]:bg-(--color-surface)",
          "[&_input]:border [&_select]:border [&_textarea]:border",
          "[&_input]:border-(--color-ink-200) [&_select]:border-(--color-ink-200) [&_textarea]:border-(--color-ink-200)",
          "focus-within:[&_input]:border-(--color-brand-500)",
          "focus-within:[&_select]:border-(--color-brand-500)",
          "focus-within:[&_textarea]:border-(--color-brand-500)",
          "[&_input]:transition-colors [&_select]:transition-colors [&_textarea]:transition-colors",
        )}
      >
        {children}
      </div>
      {error && (
        <span role="alert" className="block text-xs text-(--color-danger) mt-1">
          {error}
        </span>
      )}
    </label>
  );
}

function RadioOption({
  value,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { value: string; label: string }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-(--radius-md) bg-(--color-surface) border border-(--color-ink-200) cursor-pointer has-checked:border-(--color-brand-500) has-checked:bg-(--color-brand-50) transition-colors">
      <input
        {...props}
        type="radio"
        value={value}
        className="w-4 h-4 accent-(--color-brand-600)"
      />
      <span className="text-sm text-(--color-ink-900) font-medium">{label}</span>
    </label>
  );
}
