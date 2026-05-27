"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { TiltCard } from "@/components/ui/TiltCard";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { services } from "@/lib/services";
import { cn } from "@/lib/cn";

export function ServiceGrid({
  heading = "Featured Services",
  eyebrow = "What we do",
  description = "Comprehensive dentistry under one roof — from routine care to full-mouth restoration.",
  showAll = false,
}: {
  heading?: string;
  eyebrow?: string;
  description?: string;
  showAll?: boolean;
}) {
  const items = showAll ? services : services.filter((s) => s.featured);
  return (
    <section id="services" data-chapter="Services" className="py-24 lg:py-32 anchor-offset">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={heading} description={description} />

        <m.ul
          variants={stagger(0.06)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className={cn(
            "mt-16 grid gap-5",
            showAll
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          {items.map((s) => (
            <m.li key={s.slug} variants={fadeUp}>
              <TiltCard className="h-full group rounded-2xl">
                <Link
                  href={`/${s.slug}`}
                  className="relative block h-full p-6 rounded-2xl bg-white border border-(--color-brand-100) group-hover:border-(--color-brand-400) transition-colors hover:shadow-(--shadow-soft-lg) overflow-hidden"
                >
                  <span
                    aria-hidden
                    className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br from-(--color-brand-100) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  />
                  <div
                    className="grid place-items-center w-12 h-12 rounded-xl bg-(--color-brand-50) text-(--color-brand-600) group-hover:bg-(--color-brand-600) group-hover:text-white transition-colors"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <h3
                    className="mt-5 text-xl font-display tracking-tight"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-(--color-ink-700) leading-relaxed line-clamp-3">
                    {s.blurb}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-(--color-brand-700)">
                    Learn more
                    <m.span
                      initial={false}
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      className="inline-block"
                    >
                      <Icon name="arrow" className="w-3.5 h-3.5" />
                    </m.span>
                  </div>
                </Link>
              </TiltCard>
            </m.li>
          ))}
        </m.ul>
      </Container>
    </section>
  );
}
