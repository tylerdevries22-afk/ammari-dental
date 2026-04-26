import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-(--color-brand-100)/60 shadow-(--shadow-soft-sm)",
        "p-6",
        className,
      )}
      {...props}
    />
  );
}
