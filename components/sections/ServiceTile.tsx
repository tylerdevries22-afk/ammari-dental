"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { AnimatedIllustration } from "@/components/illustrations/AnimatedIllustration";
import { renderSceneFor } from "@/components/illustrations/scenes";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/cn";

type Props = {
  service: Service;
  className?: string;
};

/**
 * Service tile with animated illustration top + copy bottom.
 *
 * Hover behavior:
 *  - tile lifts -4 px and gets a softer shadow
 *  - illustration scales 1.05 with brand-tint background shift
 *  - title shifts left 2px (signals "go this way")
 *  - arrow slides right
 *
 * Reduced-motion: hover transforms collapse to color-only changes.
 */
export function ServiceTile({ service, className }: Props) {
  return (
    <m.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/${service.slug}`}
        className="group block h-full overflow-hidden rounded-(--radius-xl) bg-(--color-surface) border border-(--color-brand-100) shadow-(--shadow-soft-sm) hover:shadow-(--shadow-soft-lg) hover:border-(--color-brand-400) transition-all duration-500"
      >
        {/* Illustration area — square aspect, brand-tinted backdrop */}
        <div className="relative aspect-square bg-(--color-brand-50) overflow-hidden">
          {/* Backdrop gradient that warms on hover */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-(--color-brand-100)/40 via-transparent to-(--color-accent)/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          {/* Subtle radial blob */}
          <div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-(--color-brand-200)/40 blur-3xl"
          />
          {/* Illustration (the icon of the card — the redundant corner disc was removed) */}
          <div className="absolute inset-4 grid place-items-center group-hover:scale-[1.04] transition-transform duration-500 ease-out">
            <AnimatedIllustration
              className="w-full h-full"
              label={`${service.name} illustration`}
            >
              {renderSceneFor(service.slug)}
            </AnimatedIllustration>
          </div>
        </div>

        {/* Copy area */}
        <div className="p-6">
          <div className="eyebrow text-(--color-brand-600)">
            {categoryLabel(service.category)}
          </div>
          <h3 className="mt-2 text-xl font-display tracking-tight text-(--color-ink-900) group-hover:text-(--color-brand-700) transition-colors">
            {service.name}
          </h3>
          <p className="mt-2 text-sm text-(--color-ink-700) leading-relaxed line-clamp-2">
            {service.blurb}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-(--color-brand-700)">
            Learn more
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              <Icon name="arrow" className="w-3.5 h-3.5" variant="line" />
            </span>
          </div>
        </div>
      </Link>
    </m.div>
  );
}

function categoryLabel(category: string): string {
  return category
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
