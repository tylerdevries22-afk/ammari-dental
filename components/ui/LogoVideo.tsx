"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

// Reuse the splash's compressed clip (~35KB) instead of the 3.6MB master.
const SRC = "/videos/logo-splash.mp4";

type Props = {
  className?: string;
  rounded?: boolean;
};

export function LogoVideo({ className, rounded = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Ensure it plays once on mount; ignore autoplay rejections (mobile policy).
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <video
      ref={ref}
      src={SRC}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
      className={cn(
        "block w-full h-full object-cover pointer-events-none",
        rounded && "rounded-full",
        className
      )}
    />
  );
}
