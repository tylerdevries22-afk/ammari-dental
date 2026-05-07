"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { LogoVideo } from "@/components/ui/LogoVideo";
import { MobileNav } from "@/components/layout/MobileNav";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { cn } from "@/lib/cn";

type NavItem =
  | { label: string; href: string; kind?: "link" }
  | { label: string; href: string; kind: "mega" }
  | { label: string; href: string; kind: "menu"; items: { label: string; href: string }[] };

const primary: NavItem[] = [
  { label: "Home", href: "/", kind: "link" },
  {
    label: "Our Practice",
    href: "/our-dental-office-location",
    kind: "menu",
    items: [
      { label: "Improving Your Smile", href: "/-improving-your-smile" },
      { label: "Comfortable Dentistry", href: "/comfortable-dentistry" },
      { label: "Financing", href: "/financing" },
      { label: "Office Location", href: "/our-dental-office-location" },
    ],
  },
  { label: "Services", href: "/dental-services", kind: "mega" },
  {
    label: "Patient Resources",
    href: "/new-patients",
    kind: "menu",
    items: [
      { label: "New Patient Forms", href: "/-new-patient-forms" },
      { label: "Q & A", href: "/-q---a" },
      { label: "Links", href: "/links" },
      { label: "Post-Op Instructions", href: "/post-op-instructions" },
      { label: "Surgical Instructions", href: "/surgical-instructions" },
    ],
  },
  { label: "Patient Education", href: "/articles/general", kind: "link" },
  { label: "Blog", href: "/articles/general", kind: "link" },
  { label: "About Us", href: "/dental-staff", kind: "link" },
  { label: "Contact Us", href: "/contact", kind: "link" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-lg shadow-(--shadow-soft-sm) border-b border-(--color-brand-100)"
            : "bg-transparent",
        )}
      >
        <Container className="flex items-center justify-between h-[72px] gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 font-display text-xl font-medium tracking-tight shrink-0"
            aria-label="Ammari Dental — home"
          >
            <span className="block w-11 h-11 overflow-hidden">
              <LogoVideo />
            </span>
            <span className="hidden sm:inline text-[#1FA672]">Ammari Dental</span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:flex items-center gap-0.5">
            {primary.map((item) => {
              if (item.kind === "mega") {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setOpenKey(item.label)}
                    onMouseLeave={() => setOpenKey(null)}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-[13px] font-medium text-(--color-ink-700) hover:text-(--color-brand-700) transition-colors"
                    >
                      {item.label}
                    </Link>
                    <AnimatePresence>
                      {openKey === item.label && (
                        <m.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[680px]"
                        >
                          <div className="bg-white rounded-2xl shadow-(--shadow-soft-lg) border border-(--color-brand-100) p-6 grid grid-cols-2 gap-x-6 gap-y-2">
                            {services.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/${s.slug}`}
                                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-(--color-brand-50) transition-colors"
                              >
                                <span className="grid place-items-center w-9 h-9 rounded-md bg-(--color-brand-50) text-(--color-brand-600) group-hover:bg-(--color-brand-600) group-hover:text-white transition-colors">
                                  <Icon name={s.icon} className="w-4 h-4" />
                                </span>
                                <span>
                                  <span className="block text-sm font-medium text-(--color-ink-900)">{s.name}</span>
                                  <span className="block text-xs text-(--color-ink-500) line-clamp-1">{s.blurb}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              if (item.kind === "menu") {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setOpenKey(item.label)}
                    onMouseLeave={() => setOpenKey(null)}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-[13px] font-medium text-(--color-ink-700) hover:text-(--color-brand-700) transition-colors inline-flex items-center gap-1"
                    >
                      {item.label}
                      <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Link>
                    <AnimatePresence>
                      {openKey === item.label && (
                        <m.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[260px]"
                        >
                          <div className="bg-white rounded-2xl shadow-(--shadow-soft-lg) border border-(--color-brand-100) p-2">
                            {item.items.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block px-3 py-2 text-sm text-(--color-ink-700) hover:bg-(--color-brand-50) hover:text-(--color-brand-700) rounded-lg transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-[13px] font-medium text-(--color-ink-700) hover:text-(--color-brand-700) transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${site.phoneTel}`}
              className="text-sm font-semibold text-(--color-ink-700) hover:text-(--color-brand-700)"
            >
              {site.phone}
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="xl:hidden p-2 -mr-2 text-(--color-ink-900)"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.6" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </Container>
      </m.header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
