import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Variant = "default" | "glass" | "data" | "deep";

const variants: Record<Variant, string> = {
  default:
    "bg-(--color-surface) border border-(--color-brand-100)/60 shadow-(--shadow-soft-sm)",
  // Glass: for use over video / image backgrounds — frosted surface
  glass:
    "bg-(--surface-glass) backdrop-blur-md saturate-150 border border-(--color-brand-300)/30 shadow-(--shadow-soft-md)",
  // Data: monospace credibility — stats / certifications / data lockups
  data:
    "bg-(--surface-data) border border-(--color-brand-100) shadow-(--shadow-soft-sm)",
  // Deep: dark brand surface — used for video chapters and dark accents
  deep:
    "bg-(--surface-deep) border border-(--color-brand-700) text-(--color-brand-50) shadow-(--shadow-soft-lg)",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  /** Adds a subtle lift + scale on hover. Use sparingly. */
  interactive?: boolean;
};

export function Card({
  variant = "default",
  interactive = false,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "rounded-(--radius-xl) p-6 transition-all duration-300",
        variants[variant],
        interactive &&
          "hover:-translate-y-0.5 hover:shadow-(--shadow-soft-lg) hover:border-(--color-brand-400)/60 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
