"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import { FlossBox } from "./FlossBox";
import { FlossPath } from "./FlossPath";
import type { AnchorRect, SectionBounds } from "@/lib/floss-path";

export function FlossThread({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [sections, setSections] = useState<SectionBounds[]>([]);
  const [anchors, setAnchors] = useState<AnchorRect[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapperRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    const update = () => {
      setHeight(wrap.scrollHeight);
      const wrapRect = wrap.getBoundingClientRect();
      const wrapW = wrap.getBoundingClientRect().width || 1440;
      const xScale = 1440 / wrapW;

      const kids = Array.from(content.children) as HTMLElement[];
      setSections(
        kids.map((k) => {
          const r = k.getBoundingClientRect();
          return {
            top: r.top - wrapRect.top,
            bottom: r.bottom - wrapRect.top,
          };
        }),
      );

      const anchorEls = wrap.querySelectorAll<HTMLElement>(
        "[data-floss-anchor]",
      );
      setAnchors(
        Array.from(anchorEls).map((el) => {
          const r = el.getBoundingClientRect();
          return {
            top: r.top - wrapRect.top,
            bottom: r.bottom - wrapRect.top,
            left: (r.left - wrapRect.left) * xScale,
            right: (r.right - wrapRect.left) * xScale,
          };
        }),
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
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
      <div ref={contentRef}>{children}</div>
      {!reducedMotion && height > 0 && sections.length > 0 && (
        <FlossPath
          height={height}
          sections={sections}
          anchors={anchors}
          progress={scrollYProgress}
        />
      )}
      {!reducedMotion && <FlossBox progress={scrollYProgress} />}
    </div>
  );
}
