"use client";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  durationSec?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function SmoothMarquee({
  children,
  className,
  durationSec = 60,
  reverse = false,
  pauseOnHover = true,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        pauseOnHover && "[--marquee-play:running] hover:[--marquee-play:paused]",
        className,
      )}
      style={
        {
          "--marquee-duration": `${durationSec}s`,
          "--marquee-direction": reverse ? "reverse" : "normal",
        } as React.CSSProperties
      }
    >
      <div className="flex w-max gap-6 animate-[marquee-scroll_var(--marquee-duration)_linear_infinite] [animation-direction:var(--marquee-direction)] [animation-play-state:var(--marquee-play,running)] motion-reduce:[animation-play-state:paused]">
        <div className="flex shrink-0 gap-6">{children}</div>
        <div className="flex shrink-0 gap-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
