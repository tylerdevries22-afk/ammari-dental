"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import { FlossBox } from "./FlossBox";
import { FlossPath } from "./FlossPath";

export function FlossThread({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={wrapperRef} className="relative">
      {!reducedMotion && height > 0 && (
        <FlossPath height={height} progress={scrollYProgress} />
      )}
      {!reducedMotion && <FlossBox progress={scrollYProgress} />}
      {children}
    </div>
  );
}
