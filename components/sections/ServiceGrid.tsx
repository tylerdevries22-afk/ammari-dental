"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceTile } from "@/components/sections/ServiceTile";
import { ServiceIconDefs } from "@/components/illustrations/scenes";
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
      <ServiceIconDefs />
      <Container>
        <SectionHeader eyebrow={eyebrow} title={heading} description={description} />

        <m.ul
          variants={stagger(0.08)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className={cn(
            "mt-16 grid gap-6",
            showAll
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {items.map((s) => (
            <m.li key={s.slug} variants={fadeUp}>
              <ServiceTile service={s} />
            </m.li>
          ))}
        </m.ul>
      </Container>
    </section>
  );
}
