"use client";
import { m, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollHueBackground() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]), {
    stiffness: 50,
    damping: 22,
  });
  const hueRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <m.div
      aria-hidden
      style={{ y, filter: useTransform(hueRotate, (h) => `hue-rotate(${h}deg)`) }}
      className="fixed inset-0 -z-20 pointer-events-none aurora-gradient opacity-50 mask-fade-b"
    />
  );
}
