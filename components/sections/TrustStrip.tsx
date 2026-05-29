"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const items = [
  { icon: "shield", text: "Most insurance accepted" },
  { icon: "calendar", text: "Same-week openings" },
  { icon: "heart", text: "Family-friendly" },
  { icon: "alert", text: "Emergency care" },
  { icon: "star", text: "5-star reviewed" },
];

export function TrustStrip() {
  return (
    <section className="py-5 border-t border-(--color-brand-100)">
      <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-(--color-ink-700)">
        {items.map((it, i) => (
          <m.div
            key={it.text}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <Icon name={it.icon} className="w-4 h-4 text-(--color-brand-600)" />
            <span>{it.text}</span>
          </m.div>
        ))}
      </Container>
    </section>
  );
}
