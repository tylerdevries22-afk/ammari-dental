"use client";
import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Icon } from "@/components/ui/Icon";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  /** Sub-label shown in monospace below the stat, gives medical-tech texture */
  detail?: string;
  iconName?: "calendar" | "phone" | "star" | "shield" | "check" | "clock";
};

const stats: Stat[] = [
  { value: 20, suffix: "+", label: "Years in Aurora", detail: "Est. 2003 · CO Lic.", iconName: "clock" },
  { value: 18, label: "Insurance carriers in-network", detail: "Aetna · Delta · Cigna +15", iconName: "shield" },
  { value: 24, suffix: "/7", label: "Emergency line", detail: "Call (720) 443-8178", iconName: "phone" },
  { value: 100, suffix: "%", label: "HIPAA-compliant records", detail: "ISO 27001 hardware", iconName: "check" },
];

/**
 * "By the Numbers" medical-tech credibility strip.
 *
 * Renders below the hero. Each stat:
 *  - large display numeral that counts up on enter (tabular-nums)
 *  - tiny mono detail under the number that reads as a data tag
 *  - subtle icon in a brand-tinted disc
 *
 * Uses `text-aurora` gradient on the numerals for a deliberate tech-luxe finish.
 */
export function ByTheNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      id="by-the-numbers"
      data-chapter="By the numbers"
      className="relative py-20 lg:py-28 bg-(--color-surface-warm)"
    >
      <Container>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="eyebrow">By the numbers</div>
          <h2 className="mt-3 font-display text-3xl lg:text-4xl tracking-tight text-(--color-ink-900)">
            Two decades, measured.
          </h2>
          <p className="mt-3 text-(--color-ink-700) text-base lg:text-lg leading-relaxed">
            Modern hardware, contemporary protocols, and a track record you can verify.
          </p>
        </m.div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((s, i) => (
            <m.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 + i * 0.08,
              }}
              className="group relative p-6 lg:p-7 rounded-(--radius-xl) bg-(--color-surface) border border-(--color-brand-100) shadow-(--shadow-soft-sm) hover:shadow-(--shadow-soft-md) transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl lg:text-5xl font-display tracking-tight num-tabular text-(--color-brand-700)">
                  {s.prefix}
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>
                {s.iconName && (
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-(--color-brand-50) text-(--color-brand-600) group-hover:bg-(--color-brand-100) transition-colors">
                    <Icon name={s.iconName} className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm font-medium text-(--color-ink-900) leading-snug">
                {s.label}
              </div>
              {s.detail && (
                <div className="mt-2 data-mono text-[10px] uppercase text-(--color-ink-500)">
                  {s.detail}
                </div>
              )}
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
