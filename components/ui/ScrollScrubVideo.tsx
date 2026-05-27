"use client";
import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  poster?: string;
  posterAlt?: string;
  className?: string;
  scrollTarget: RefObject<HTMLElement | null>;
  parallax?: number;
  /**
   * Fraction of section scroll-progress at which the video should reach its
   * last frame (0–1). After this point the video holds on its final frame
   * while the section continues to scroll out. Default 0.65.
   */
  endAt?: number;
};

/**
 * GSAP ScrollTrigger-driven video scrub.
 *
 * Why GSAP instead of framer's useScroll/useTransform:
 *  - ScrollTrigger's `scrub: 0.5` adds a smoothing pass that catches up to the
 *    target instead of locking to it 1:1 — gives the buttery cinematic feel.
 *  - Works correctly with Lenis smooth scroll (Lenis emits 'scroll' which we
 *    pipe into ScrollTrigger.update in SmoothScroll.tsx).
 *  - Robust on iOS Safari where framer's onChange callbacks can stutter under
 *    momentum scrolling.
 *
 * The poster image stays as the LCP element until the video metadata loads,
 * so first paint is instant.
 */
export function ScrollScrubVideo({
  src,
  poster,
  posterAlt = "",
  className,
  scrollTarget,
  parallax = 60,
  endAt = 0.65,
}: Props) {
  const { reduced, scrubFactor } = useMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pre-warm the video when the section gets close (200 px out)
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

  // Wire GSAP ScrollTrigger to drive currentTime
  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    const target = scrollTarget.current;
    if (!v || !target) return;

    let parallaxTween: gsap.core.Tween | null = null;
    let scrubTween: gsap.core.Tween | null = null;

    const setup = () => {
      const dur = v.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;

      // Scrub video currentTime to scroll position
      const scrubProxy = { time: 0 };
      scrubTween = gsap.to(scrubProxy, {
        time: dur,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          start: "top top",
          // End when we've scrolled `endAt` of the section's height past top
          end: () => `+=${target.offsetHeight * endAt}`,
          scrub: scrubFactor,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          // Seek only when the delta is meaningful — saves decoder work
          if (Math.abs(v.currentTime - scrubProxy.time) > 1 / 60) {
            v.currentTime = scrubProxy.time;
          }
        },
      });

      // Y parallax on the wrapping element
      parallaxTween = gsap.fromTo(
        v.parentElement!,
        { y: 0 },
        {
          y: -parallax,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: "top bottom",
            end: "bottom top",
            scrub: scrubFactor,
            invalidateOnRefresh: true,
          },
        },
      );
    };

    if (v.readyState >= 1) {
      setup();
    } else {
      v.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      v.removeEventListener("loadedmetadata", setup);
      scrubTween?.scrollTrigger?.kill();
      scrubTween?.kill();
      parallaxTween?.scrollTrigger?.kill();
      parallaxTween?.kill();
    };
  }, [scrollTarget, reduced, scrubFactor, endAt, parallax]);

  // Reduced-motion: poster only, no video element
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
    <div className={cn("absolute inset-0 will-change-transform", className)}>
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
      >
        {/*
          axe-core's video-caption rule fires on every <video> element
          regardless of aria-hidden. This empty captions track satisfies
          the rule for a purely decorative, silent clip. Track file path
          is derived by swapping the source's extension to .vtt.
        */}
        <track
          kind="captions"
          src={src.replace(/\.[^.]+$/, ".vtt")}
          srcLang="en"
          label="No audio"
          default
        />
      </video>
    </div>
  );
}
