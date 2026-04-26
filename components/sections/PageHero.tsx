"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
}) {
  return (
    <section className="relative pt-[88px] pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-(--color-brand-100) to-transparent blur-3xl opacity-60 -z-10" />
      <Container>
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
          <h1 className="text-[clamp(34px,5.5vw,61px)] font-display tracking-[-0.025em] leading-[1.02]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-lg text-(--color-ink-700) leading-relaxed">{description}</p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </m.div>
      </Container>
    </section>
  );
}
