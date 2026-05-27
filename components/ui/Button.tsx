"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "glass" | "data";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-(--color-brand-600) text-white hover:bg-(--color-brand-700) shadow-(--shadow-soft-md)",
  secondary:
    "bg-white text-(--color-ink-900) border border-(--color-ink-300) hover:border-(--color-brand-400) hover:text-(--color-brand-700)",
  ghost:
    "bg-transparent text-(--color-ink-900) hover:bg-(--color-brand-50)",
  danger:
    "bg-(--color-danger) text-white hover:opacity-90",
  // Glass: meant for use on video / dark backgrounds. Frosted surface + brand border.
  glass:
    "bg-(--surface-glass) text-(--color-brand-700) border border-(--color-brand-300)/40 backdrop-blur-md hover:bg-(--color-surface) hover:border-(--color-brand-500) shadow-(--shadow-soft-sm)",
  // Data: monospace credibility CTA — used near stats/credentials.
  data:
    "bg-(--color-brand-700) text-(--color-brand-50) data-mono uppercase text-[11px] tracking-widest border border-(--color-brand-500) hover:bg-(--color-brand-800)",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", href, external, iconStart, iconEnd, children, className, ...rest },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all",
    "focus-visible:ring-2 focus-visible:ring-(--color-brand-400) focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {iconStart}
      <span>{children}</span>
      {iconEnd}
    </>
  );

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <m.a
          href={href}
          className={classes}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {content}
        </m.a>
      );
    }
    return (
      <m.span
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="inline-flex"
      >
        <Link href={href} className={classes}>
          {content}
        </Link>
      </m.span>
    );
  }

  return (
    <m.button
      ref={ref}
      className={classes}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      {...(rest as React.ComponentProps<typeof m.button>)}
    >
      {content}
    </m.button>
  );
});
