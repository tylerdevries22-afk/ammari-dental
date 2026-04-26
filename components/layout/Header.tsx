"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MobileNav } from "@/components/layout/MobileNav";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { cn } from "@/lib/cn";

const primary = [
  { label: "Services", href: "/dental-services", mega: true },
  { label: "Meet the Doctor", href: "/dental-staff" },
  { label: "New Patients", href: "/new-patients" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
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
            ? "bg-white/85 backdrop-blur-lg shadow-[--shadow-soft-sm] border-b border-[--color-brand-100]"
            : "bg-transparent",
        )}
      >
        <Container className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 font-display text-xl font-medium tracking-tight" aria-label="Ammari Dental — home">
            <Image
              src="/images/practice/logo.webp"
              alt=""
              width={40}
              height={40}
              priority
              className="w-10 h-10 object-contain"
            />
            <span>Ammari Dental</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {primary.map((item) =>
              item.mega ? (
                <div
                  key={item.label}
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-[--color-ink-700] hover:text-[--color-brand-700] transition-colors"
                  >
                    {item.label}
                  </Link>
                  <AnimatePresence>
                    {megaOpen && (
                      <m.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[680px]"
                      >
                        <div className="bg-white rounded-2xl shadow-[--shadow-soft-lg] border border-[--color-brand-100] p-6 grid grid-cols-2 gap-x-6 gap-y-2">
                          {services.map((s) => (
                            <Link
                              key={s.slug}
                              href={`/${s.slug}`}
                              className="group flex items-start gap-3 p-2 rounded-lg hover:bg-[--color-brand-50] transition-colors"
                            >
                              <span className="grid place-items-center w-9 h-9 rounded-md bg-[--color-brand-50] text-[--color-brand-600] group-hover:bg-[--color-brand-600] group-hover:text-white transition-colors">
                                <Icon name={s.icon} className="w-4 h-4" />
                              </span>
                              <span>
                                <span className="block text-sm font-medium text-[--color-ink-900]">{s.name}</span>
                                <span className="block text-xs text-[--color-ink-500] line-clamp-1">{s.blurb}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-[--color-ink-700] hover:text-[--color-brand-700] transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${site.phoneTel}`}
              className="text-sm font-semibold text-[--color-ink-700] hover:text-[--color-brand-700]"
            >
              {site.phone}
            </a>
            <Button href="/appointment" size="sm">Book Appointment</Button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[--color-ink-900]"
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
