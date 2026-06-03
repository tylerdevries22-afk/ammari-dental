"use client";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/lib/useMotion";

type Chapter = { id: string; label: string };

/**
 * Right-margin vertical scroll indicator with chapter markers.
 *
 * Auto-discovers chapter sections via `[data-chapter]` attribute on
 * elements within `<main>`. Each chapter:
 *  - shows a dot + label that grows when the chapter is the active one
 *  - is clickable; click scrolls to that section (Lenis-friendly via
 *    Element.scrollIntoView which Lenis intercepts)
 *  - "active" is the chapter whose top is closest above viewport center
 *
 * Hidden on screens narrower than xl (1280px).
 * Hidden under reduced-motion.
 */
export function SectionScrollIndicator() {
  const { enabled } = useMotion();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const scan = () => {
      const nodes = document.querySelectorAll<HTMLElement>("main [data-chapter]");
      setChapters(
        Array.from(nodes)
          .filter((n) => n.id || n.dataset.chapterId)
          .map((n) => ({
            id: n.id || (n.dataset.chapterId as string),
            label: n.dataset.chapter || "Section",
          })),
      );
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || chapters.length === 0) return;

    const update = () => {
      tickingRef.current = false;
      const viewportMid = window.innerHeight / 2;
      let bestId: string | null = null;
      let bestDistance = Infinity;
      chapters.forEach((c) => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        // distance from top edge to viewport mid (negative = above)
        const distance = Math.abs(r.top + r.height / 2 - viewportMid);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = c.id;
        }
      });
      setActiveId(bestId);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, chapters]);

  if (!enabled || chapters.length < 2) return null;

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[var(--z-rise,10)] hidden xl:flex flex-col gap-3"
    >
      {chapters.map((c) => {
        const active = activeId === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group flex items-center gap-3 justify-end"
            onClick={(e) => {
              const el = document.getElementById(c.id);
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${c.id}`);
              }
            }}
          >
            <span
              className={`data-mono text-[10px] uppercase tracking-widest text-(--color-ink-500) opacity-0 -translate-x-1 transition-all duration-300 ${
                active ? "opacity-100 translate-x-0" : "group-hover:opacity-70 group-hover:translate-x-0"
              }`}
            >
              {c.label}
            </span>
            <span
              className={`relative block rounded-full border transition-all duration-300 ${
                active
                  ? "w-3 h-3 border-(--color-brand-600) bg-(--color-brand-600)"
                  : "w-2 h-2 border-(--color-ink-300) bg-transparent group-hover:border-(--color-brand-600)"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
