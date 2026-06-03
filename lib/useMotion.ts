"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const noopSubscribe = () => () => {};

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
  // false on the server and during the first client render, true thereafter.
  // useSyncExternalStore hands React a distinct server snapshot so this never
  // causes a hydration mismatch and needs no setState-in-effect.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setManualReduced(root.dataset.motion === "reduce");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => obs.disconnect();
  }, []);

  // Until mounted, always report motion-enabled so the server and the first
  // client render produce identical markup. framer's useReducedMotion resolves
  // the real preference on the first client render, so any component that
  // branches its DOM on motion would otherwise hydrate-mismatch for
  // reduced-motion users. The real preference takes effect right after mount.
  const reduced = mounted && (Boolean(osReduced) || manualReduced);

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
