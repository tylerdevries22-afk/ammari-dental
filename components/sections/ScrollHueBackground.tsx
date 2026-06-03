"use client";
import { m, useScroll, useTransform } from "framer-motion";

// Uses opacity crossfade between two static gradients instead of
// filter:hue-rotate() — achieves the same colour-shift effect but
// keeps every animated property compositor-only (transform + opacity).
export function ScrollHueBackground() {
  const { scrollYProgress } = useScroll();
  const y       = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-20 pointer-events-none mask-fade-b"
      style={{ willChange: "auto" }}
    >
      {/* Base gradient — visible at top of page */}
      <m.div
        style={{ y }}
        className="absolute inset-0 opacity-50"
        // eslint-disable-next-line react/no-unknown-property
      >
        <div className="absolute inset-0 aurora-gradient" />
      </m.div>

      {/* Shifted gradient — fades in as user scrolls */}
      <m.div
        style={{ y, opacity }}
        className="absolute inset-0 opacity-50"
      >
        <div className="absolute inset-0 aurora-gradient-warm" />
      </m.div>
    </div>
  );
}
