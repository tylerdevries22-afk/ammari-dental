"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";
import { StepIndicator, type Step } from "./StepIndicator";
import { ReasonStep } from "./ReasonStep";
import { ProviderStep } from "./ProviderStep";
import { SlotGrid } from "./SlotGrid";
import { PatientInfoStep } from "./PatientInfoStep";
import { ReviewStep } from "./ReviewStep";
import { ConfirmedScreen } from "./ConfirmedScreen";
import { Skeleton } from "./Skeleton";
import type {
  BookingConfirmation,
  PatientInfo,
  Provider,
  Reason,
  Slot,
} from "@/lib/booking/types";

const STEPS: Step[] = [
  { id: "reason", label: "Reason" },
  { id: "provider", label: "Provider" },
  { id: "time", label: "Time" },
  { id: "you", label: "About you" },
  { id: "review", label: "Review" },
];

type State = {
  step: number;
  reason: Reason | null;
  provider: Provider | null;
  slot: Slot | null;
  patient: PatientInfo | null;
};

const INITIAL: State = {
  step: 0,
  reason: null,
  provider: null,
  slot: null,
  patient: null,
};

type SlotsResult = { key: string; slots: Slot[] };

export function BookingPicker() {
  const { enabled } = useMotion();
  const [state, setState] = useState<State>(INITIAL);
  const [reasons, setReasons] = useState<Reason[] | null>(null);
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [slotsResult, setSlotsResult] = useState<SlotsResult | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The signature of the availability request currently selected. Derived
  // from state so we never have to push it into setState within an effect.
  const slotsKey =
    state.step === 2 && state.reason
      ? `${state.reason.id}|${state.provider?.id ?? ""}`
      : null;
  const loadingSlots = slotsKey !== null && slotsResult?.key !== slotsKey;
  const slots =
    slotsResult && slotsResult.key === slotsKey ? slotsResult.slots : [];

  // Bootstrap reasons + providers.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/booking/providers");
        const data = await res.json();
        if (cancelled) return;
        if (data.ok) {
          setReasons(data.reasons);
          setProviders(data.providers);
        }
      } catch {
        if (!cancelled)
          setError("We couldn't load openings. Please refresh or call us.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Refetch slots whenever the (reason, provider) signature changes while
  // we're on the time step. The state update is queued only inside the
  // async callback, never synchronously inside the effect body.
  useEffect(() => {
    if (!slotsKey || !state.reason) return;
    let cancelled = false;
    const startDate = new Date().toISOString().slice(0, 10);
    const params = new URLSearchParams({
      reasonId: state.reason.id,
      startDate,
      days: "30",
    });
    if (state.provider) params.set("providerId", state.provider.id);
    (async () => {
      try {
        const res = await fetch(`/api/booking/availability?${params}`);
        const data = await res.json();
        if (cancelled) return;
        setSlotsResult({ key: slotsKey, slots: data.ok ? data.slots : [] });
      } catch {
        if (!cancelled) setSlotsResult({ key: slotsKey, slots: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slotsKey, state.reason, state.provider]);

  const goTo = useCallback((step: number) => {
    setError(null);
    setState((s) => ({ ...s, step }));
  }, []);

  const next = () => goTo(Math.min(state.step + 1, STEPS.length - 1));
  const back = () => goTo(Math.max(state.step - 1, 0));

  const filteredProviders = useMemo(() => {
    if (!providers || !state.reason) return providers ?? [];
    return providers.filter((p) => p.acceptsReasons.includes(state.reason!.id));
  }, [providers, state.reason]);

  const canAdvance = useMemo(() => {
    if (state.step === 0) return !!state.reason;
    if (state.step === 1) return true;
    if (state.step === 2) return !!state.slot;
    if (state.step === 3) return !!state.patient;
    return false;
  }, [state]);

  async function submitConfirm() {
    if (!state.reason || !state.slot || !state.patient) return;
    const attemptId = crypto.randomUUID();
    const providerId = state.provider?.id ?? state.slot.providerId;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: state.slot.id,
          reasonId: state.reason.id,
          providerId,
          attemptId,
          acknowledged: true,
          patient: state.patient,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(
          data.message ?? "We couldn't book that time. Please pick another.",
        );
        if (data.error === "INVALID_SLOT") goTo(2);
        return;
      }
      setConfirmation(data.confirmation);
    } catch {
      setError("Something went wrong on our end. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100) p-8 lg:p-10">
        <ConfirmedScreen confirmation={confirmation} />
      </div>
    );
  }

  function renderStep() {
    if (state.step === 0) {
      if (!reasons)
        return (
          <div className="grid sm:grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        );
      return (
        <ReasonStep
          reasons={reasons}
          value={state.reason?.id ?? null}
          onChange={(id) => {
            const r = reasons.find((x) => x.id === id) ?? null;
            setState((s) => ({ ...s, reason: r, provider: null, slot: null }));
          }}
        />
      );
    }
    if (state.step === 1) {
      if (!filteredProviders.length) return <Skeleton className="h-40" />;
      return (
        <ProviderStep
          providers={filteredProviders}
          value={state.provider?.id ?? null}
          onChange={(id) => {
            const p = id
              ? (filteredProviders.find((x) => x.id === id) ?? null)
              : null;
            setState((s) => ({ ...s, provider: p, slot: null }));
          }}
        />
      );
    }
    if (state.step === 2) {
      return (
        <div>
          <h2 className="font-display text-2xl tracking-tight">Pick a time</h2>
          <p className="mt-2 text-(--color-ink-700)">
            Times are Mountain Time.{" "}
            {state.reason?.urgent && "Calling is fastest for active pain."}
          </p>
          <div className="mt-6">
            <SlotGrid
              slots={slots}
              loading={loadingSlots}
              value={state.slot}
              onChange={(slot) => setState((s) => ({ ...s, slot }))}
            />
          </div>
        </div>
      );
    }
    if (state.step === 3 && state.reason) {
      return (
        <PatientInfoStep
          defaultIsNewPatient={state.reason.requiresNewPatient}
          initial={state.patient}
          onSubmit={(patient) => {
            setState((s) => ({ ...s, patient }));
            goTo(4);
          }}
        />
      );
    }
    if (state.step === 4 && state.reason && state.slot && state.patient) {
      const provider =
        state.provider ??
        providers?.find((p) => p.id === state.slot!.providerId) ??
        null;
      if (!provider) return null;
      return (
        <ReviewStep
          reason={state.reason}
          provider={provider}
          slot={state.slot}
          patient={state.patient}
          submitting={submitting}
          error={error}
          onConfirm={submitConfirm}
        />
      );
    }
    return null;
  }

  return (
    <div className="rounded-3xl bg-(--color-surface) shadow-(--shadow-soft-md) border border-(--color-brand-100) p-6 sm:p-8 lg:p-10">
      <StepIndicator steps={STEPS} current={state.step} />

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={state.step}
            initial={enabled ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={enabled ? { opacity: 0, y: -8 } : undefined}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderStep()}
          </m.div>
        </AnimatePresence>
      </div>

      {error && state.step !== 4 && (
        <p
          role="alert"
          className="mt-4 rounded-(--radius-md) bg-(--color-danger)/10 text-(--color-danger) text-sm px-4 py-3"
        >
          {error}
        </p>
      )}

      <NavBar
        step={state.step}
        canAdvance={canAdvance}
        onBack={back}
        onNext={() => {
          if (state.step === 3) {
            // Patient-info step uses the form's submit handler, not Next.
            const form = document.getElementById(
              "booking-patient-info-form",
            ) as HTMLFormElement | null;
            form?.requestSubmit();
            return;
          }
          next();
        }}
      />
    </div>
  );
}

function NavBar({
  step,
  canAdvance,
  onBack,
  onNext,
}: {
  step: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  if (step === 4) return null; // Review step renders its own confirm button.
  return (
    <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-(--color-ink-200)">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 0}
        className={cn(
          "inline-flex items-center justify-center h-11 px-5 rounded-full font-semibold transition-colors",
          "text-(--color-ink-900) hover:bg-(--color-brand-50) disabled:opacity-40 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
        )}
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canAdvance}
        className="inline-flex items-center justify-center h-11 px-6 rounded-full font-semibold bg-(--color-brand-600) text-(--color-brand-50) hover:bg-(--color-brand-700) shadow-(--shadow-soft-md) transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2"
      >
        Continue →
      </button>
    </div>
  );
}
