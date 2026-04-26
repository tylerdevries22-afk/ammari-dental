"use client";
import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-display tracking-tight mb-8">Frequently Asked Questions</h2>
      <ul className="divide-y divide-(--color-brand-100) border-y border-(--color-brand-100)">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={it.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left py-5 flex items-start justify-between gap-6 hover:text-(--color-brand-700) transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg">{it.q}</span>
                <m.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center w-8 h-8 rounded-full bg-(--color-brand-50) text-(--color-brand-600) shrink-0"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </m.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-(--color-ink-700) leading-relaxed max-w-3xl">{it.a}</p>
                  </m.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
