"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
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
  /**
   * Preload the poster at high priority. Only set this when the component is
   * genuinely above the fold — its sole current consumer (AboutSplit) sits
   * mid-page, where preloading competed with the real LCP image.
   */
  priority?: boolean;
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
  /**
   * Skip past any opening black frame by seeking the video to this offset
   * (seconds) once metadata loads. Set to 0 to disable. Default 0.08 — enough
   * to clear a single fade-in frame on a 30 fps source without an obvious cut.
   */
  startOffset = 0.08,
  priority = false,
}: Props & { startOffset?: number }) {
  const { reduced, scrubFactor } = useMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

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

  // Seek past any leading black frame the moment metadata is available, so
  // the first visible frame is not a fade-in / slate. Done before GSAP scrub
  // wires up — GSAP picks up from wherever currentTime is now sitting.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || startOffset <= 0) return;
    const seek = () => {
      if (Number.isFinite(v.duration) && v.duration > startOffset) {
        try {
          v.currentTime = startOffset;
        } catch {
          // ignore; some browsers throw if not seekable yet
        }
      }
    };
    const onSeeked = () => setVideoReady(true);
    if (v.readyState >= 1) seek();
    else v.addEventListener("loadedmetadata", seek, { once: true });
    v.addEventListener("seeked", onSeeked, { once: true });
    return () => {
      v.removeEventListener("loadedmetadata", seek);
      v.removeEventListener("seeked", onSeeked);
    };
  }, [startOffset]);

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

      // Scrub video currentTime to scroll position, starting from startOffset
      const scrubProxy = { time: startOffset };
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
  }, [scrollTarget, reduced, scrubFactor, endAt, parallax, startOffset]);

  // Reduced-motion: poster only, no video element
  if (reduced && poster) {
    return (
      <div className={cn("absolute inset-0", className)}>
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority={priority}
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
          priority={priority}
          sizes="(max-width: 1024px) 90vw, 40vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            // Keep the poster covering the video until the seek has landed —
            // prevents any black frame from showing during the first paint.
            videoReady ? "opacity-0" : "opacity-100",
          )}
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
        // Decorative video — excluded from axe scans via the test config so
        // we don't need a captions <track> here.
        {...({ "webkit-playsinline": "true" } as Record<string, string>)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
