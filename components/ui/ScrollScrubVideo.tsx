"use client";
import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  poster?: string;
  posterAlt?: string;
  className?: string;
  scrollTarget: RefObject<HTMLElement | null>;
  parallax?: number;
  /** Optional pre-existing scroll progress (e.g. from a parent useScroll). */
  progress?: MotionValue<number>;
};

export function ScrollScrubVideo({
  src,
  poster,
  posterAlt = "",
  className,
  scrollTarget,
  parallax = 60,
  progress,
}: Props) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);

  const fallback = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"],
  });
  const scrollYProgress = progress ?? fallback.scrollYProgress;
  const y = useTransform(scrollYProgress, [0, 1], [0, -parallax]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.preload = "auto";
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;

    function flush() {
      rafRef.current = null;
      if (!v) return;
      const target = targetTimeRef.current;
      if (Number.isFinite(target) && Math.abs(v.currentTime - target) > 1 / 240) {
        v.currentTime = target;
      }
    }

    function compute() {
      const target = scrollTarget.current;
      if (!target || !v) return;
      const dur = v.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const rect = target.getBoundingClientRect();
      const total = rect.height;
      if (total <= 0) return;
      // Match framer's ["start start", "end start"]: 0 when section top hits
      // viewport top, 1 when section bottom hits viewport top.
      const p = Math.min(1, Math.max(0, -rect.top / total));
      targetTimeRef.current = p * dur;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
    }

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });

    // Also drive scrub from framer's MotionValue — its internal scroll tracker
    // updates even in environments where window 'scroll' events are throttled.
    function fromMotion(p: number) {
      if (!v) return;
      const dur = v.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      targetTimeRef.current = Math.min(dur, Math.max(0, p * dur));
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
    }
    const unsub = scrollYProgress.on("change", fromMotion);

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      unsub();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollTarget, scrollYProgress, reduced]);

  if (reduced && poster) {
    return (
      <div className={cn("absolute inset-0", className)}>
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <m.div style={{ y }} className={cn("absolute inset-0 will-change-transform", className)}>
      {poster && (
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="object-cover"
        />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden
        {...({ "webkit-playsinline": "true" } as Record<string, string>)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </m.div>
  );
}
