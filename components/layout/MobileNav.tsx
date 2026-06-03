"use client";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

type Section = {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
};

const sections: Section[] = [
  { label: "Home", href: "/" },
  {
    label: "Our Practice",
    items: [
      { label: "Improving Your Smile", href: "/-improving-your-smile" },
      { label: "Comfortable Dentistry", href: "/comfortable-dentistry" },
      { label: "Financing", href: "/financing" },
      { label: "Office Location", href: "/our-dental-office-location" },
    ],
  },
  {
    label: "Services",
    items: services.map((s) => ({ label: s.name, href: `/${s.slug}` })),
  },
  {
    label: "Patient Resources",
    items: [
      { label: "New Patient Forms", href: "/-new-patient-forms" },
      { label: "Q & A", href: "/-q---a" },
      { label: "Links", href: "/links" },
      { label: "Post-Op Instructions", href: "/post-op-instructions" },
      { label: "Surgical Instructions", href: "/surgical-instructions" },
    ],
  },
  { label: "Patient Education", href: "/articles/general" },
  { label: "Blog", href: "/articles/general" },
  { label: "About Us", href: "/dental-staff" },
  { label: "Contact Us", href: "/contact" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] xl:hidden"
        >
          <div className="absolute inset-0 bg-(--color-ink-900)/40" onClick={onClose} />
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-(--shadow-soft-lg) flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-(--color-brand-100)">
              <span className="font-display text-lg">Menu</span>
              <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              {sections.map((s) =>
                s.items ? (
                  <div key={s.label}>
                    <button
                      onClick={() => setOpenLabel(openLabel === s.label ? null : s.label)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-(--color-ink-900)"
                    >
                      {s.label}
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        style={{
                          transform: openLabel === s.label ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {openLabel === s.label && (
                        <m.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 border-l-2 border-(--color-brand-100) ml-3"
                        >
                          {s.items.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={onClose}
                                className="block py-2 text-sm text-(--color-ink-700)"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </m.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={s.label}
                    href={s.href!}
                    onClick={onClose}
                    className="block px-3 py-3 text-base font-medium text-(--color-ink-900) hover:bg-(--color-brand-50) rounded-lg"
                  >
                    {s.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="p-4 border-t border-(--color-brand-100) grid gap-3">
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="md">
                Call {site.phone}
              </Button>
              <Button href="/appointment" size="md">Book Appointment</Button>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-(--color-brand-200) text-(--color-brand-700) text-sm font-semibold hover:bg-(--color-brand-50) transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  Log In
                </Link>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-(--color-brand-600) text-white text-sm font-semibold hover:bg-(--color-brand-700) transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  Sign Up
                </Link>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
