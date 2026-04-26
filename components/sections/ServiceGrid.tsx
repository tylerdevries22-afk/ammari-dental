"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
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
    <section className="py-24 lg:py-32">
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
              <Link
                href={`/${s.slug}`}
                className="group block h-full p-6 rounded-2xl bg-white border border-[--color-brand-100] hover:border-[--color-brand-400] transition-all hover:-translate-y-1 hover:shadow-[--shadow-soft-lg]"
              >
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-[--color-brand-50] text-[--color-brand-600] group-hover:bg-[--color-brand-600] group-hover:text-white transition-colors">
                  <Icon name={s.icon} className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-xl font-display tracking-tight">{s.name}</h3>
                <p className="mt-2 text-sm text-[--color-ink-700] leading-relaxed line-clamp-3">
                  {s.blurb}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[--color-brand-700]">
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
            </m.li>
          ))}
        </m.ul>
      </Container>
    </section>
  );
}
