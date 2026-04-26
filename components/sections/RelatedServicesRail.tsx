"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { relatedServices } from "@/lib/services";
import { fadeUp, stagger, reveal } from "@/lib/motion";

export function RelatedServicesRail({ slug }: { slug: string }) {
  const items = relatedServices(slug, 3);
  if (!items.length) return null;
  return (
    <section className="mt-20 pt-12 border-t border-[--color-brand-100]">
      <h2 className="text-2xl lg:text-3xl font-display tracking-tight mb-8">Related Services</h2>
      <m.ul
        variants={stagger(0.08)}
        initial={reveal.initial}
        whileInView={reveal.whileInView}
        viewport={reveal.viewport}
        className="grid sm:grid-cols-3 gap-5"
      >
        {items.map((s) => (
          <m.li key={s.slug} variants={fadeUp}>
            <Link
              href={`/${s.slug}`}
              className="group block h-full p-6 rounded-2xl bg-white border border-[--color-brand-100] hover:border-[--color-brand-400] transition-all hover:-translate-y-1 hover:shadow-[--shadow-soft-md]"
            >
              <div className="grid place-items-center w-10 h-10 rounded-lg bg-[--color-brand-50] text-[--color-brand-600]">
                <Icon name={s.icon} className="w-4 h-4" />
              </div>
              <div className="mt-4 font-display text-lg">{s.name}</div>
              <p className="mt-1 text-sm text-[--color-ink-700] line-clamp-2">{s.blurb}</p>
            </Link>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
