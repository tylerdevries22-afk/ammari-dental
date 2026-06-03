"use client";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  const { enabled } = useMotion();
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-(--radius-md) bg-(--color-surface-muted)",
        enabled && "animate-pulse",
        className,
      )}
    />
  );
}
