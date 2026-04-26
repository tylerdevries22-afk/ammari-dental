"use client";
import { m, useScroll, useTransform } from "framer-motion";

export function ScrollHueBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const filter = useTransform(scrollYProgress, [0, 1], [0, 30], {
    clamp: true,
  });
  const filterStr = useTransform(filter, (h) => `hue-rotate(${h}deg)`);

  return (
    <m.div
      aria-hidden
      style={{ y, filter: filterStr }}
      className="fixed inset-0 -z-20 pointer-events-none aurora-gradient opacity-50 mask-fade-b"
    />
  );
}
