import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="marquee-track flex gap-12 w-max">
        {children}
        {children}
      </div>
    </div>
  );
}
