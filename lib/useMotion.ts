"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Centralized motion contract.
 *
 * Combines OS-level `prefers-reduced-motion` with a manual override stored on
 * the <html> element as `data-motion="reduce"`. Components that hand off
 * heavy work (canvas, WebGL, video scrub) should read `enabled` and bail.
 *
 * `scrubFactor` is the smoothing constant for scroll-scrubbed timelines —
 * 0 = no smoothing (1:1 with scroll), 1.0 = very lazy catch-up. GSAP
 * ScrollTrigger's `scrub` accepts the same scale.
 */
export function useMotion() {
  const osReduced = useReducedMotion();
  const [manualReduced, setManualReduced] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setManualReduced(root.dataset.motion === "reduce");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => obs.disconnect();
  }, []);

  const reduced = Boolean(osReduced) || manualReduced;

  return {
    reduced,
    enabled: !reduced,
    scrubFactor: reduced ? 0 : 0.5,
    duration: {
      fast: reduced ? 0 : 0.18,
      base: reduced ? 0 : 0.32,
      slow: reduced ? 0 : 0.56,
      deliberate: reduced ? 0 : 0.9,
    },
  };
}
