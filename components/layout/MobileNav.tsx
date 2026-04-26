"use client";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showServices, setShowServices] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <div className="absolute inset-0 bg-[--color-ink-900]/40" onClick={onClose} />
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-[--shadow-soft-lg] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-[--color-brand-100]">
              <span className="font-display text-lg">Menu</span>
              <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <button
                onClick={() => setShowServices(!showServices)}
                className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-[--color-ink-900]"
              >
                Services
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  style={{ transform: showServices ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence>
                {showServices && (
                  <m.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-3 border-l-2 border-[--color-brand-100] ml-3"
                  >
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          onClick={onClose}
                          className="block py-2 text-sm text-[--color-ink-700]"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>

              {[
                { label: "Meet the Doctor", href: "/dental-staff" },
                { label: "New Patients", href: "/new-patients" },
                { label: "Reviews", href: "/reviews" },
                { label: "Testimonials", href: "/testimonials" },
                { label: "Gallery", href: "/gallery" },
                { label: "Financing", href: "/financing" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={onClose}
                  className="block px-3 py-3 text-base font-medium text-[--color-ink-900] hover:bg-[--color-brand-50] rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-[--color-brand-100] grid gap-3">
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="md">
                Call {site.phone}
              </Button>
              <Button href="/appointment" size="md">Book Appointment</Button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
