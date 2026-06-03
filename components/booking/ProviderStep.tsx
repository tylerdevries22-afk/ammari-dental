"use client";
import Image from "next/image";
import type { Provider } from "@/lib/booking/types";
import { cn } from "@/lib/cn";

export function ProviderStep({
  providers,
  value,
  onChange,
}: {
  providers: Provider[];
  value: string | null;
  onChange: (providerId: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight">
        Who would you like to see?
      </h2>
      <p className="mt-2 text-(--color-ink-700)">
        Any opening, or pick a provider.
      </p>

      <div
        role="radiogroup"
        aria-label="Provider"
        className="mt-6 grid sm:grid-cols-2 gap-3"
      >
        <ProviderCard
          provider={null}
          active={value === null}
          onClick={() => onChange("")}
        />
        {providers.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            active={value === p.id}
            onClick={() => onChange(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
  active,
  onClick,
}: {
  provider: Provider | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 text-left rounded-(--radius-lg) p-4 border-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
        active
          ? "bg-(--color-brand-50) border-(--color-brand-500)"
          : "bg-(--color-surface) border-(--color-ink-200) hover:border-(--color-brand-300)",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center shrink-0 rounded-full overflow-hidden",
          "w-14 h-14 bg-(--color-brand-100) text-(--color-brand-700)",
        )}
      >
        {provider?.photoUrl ? (
          <Image
            src={provider.photoUrl}
            alt=""
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-display text-lg">
            {provider ? provider.name.split(" ").map((s) => s[0]).join("").slice(0, 2) : "Any"}
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg text-(--color-ink-900)">
          {provider ? provider.name : "First available"}
        </span>
        <span className="block text-xs uppercase tracking-(--tracking-widest) text-(--color-ink-500) mt-0.5">
          {provider ? provider.role : "Soonest opening across the team"}
        </span>
        {provider?.bio && (
          <span className="block text-sm text-(--color-ink-700) mt-2">{provider.bio}</span>
        )}
      </span>
    </button>
  );
}
