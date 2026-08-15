"use client";
import Link from "next/link";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { getArticle } from "@/lib/articles";

/**
 * Editorial pick for the homepage, resolved against the real article data.
 *
 * These were previously hand-written title/slug literals that pointed at
 * slugs which never existed — all eight tiles 404'd. Looking each one up by
 * slug means a tile can only render if its article is really there, and the
 * title/topic always match the library.
 */
const FEATURED_SLUGS = [
  "502374-brushing",
  "502377-cavities-and-tooth-decay",
  "502432-root-canal-therapy",
  "502402-implants",
  "502386-dentures",
  "502420-oral-cancer",
  "502387-diabetes",
  "502370-bleaching",
];

const articles = FEATURED_SLUGS.map((slug) => getArticle("general", slug)).filter(
  (a): a is NonNullable<typeof a> => Boolean(a),
);

export function ArticlesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Patient education"
          title="Featured Articles"
          description="Read about helpful topics — straight from our patient education library."
        />
        <m.ul
          variants={stagger(0.05)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {articles.map((a) => (
            <m.li key={a.slug} variants={fadeUp}>
              <Link
                href={a.slug}
                className="group block h-full p-6 rounded-2xl bg-white border border-(--color-brand-100) hover:border-(--color-brand-400) transition-all hover:-translate-y-1 hover:shadow-(--shadow-soft-md)"
              >
                <div className="text-xs uppercase tracking-widest font-semibold text-(--color-brand-600)">
                  {a.topic}
                </div>
                <div className="mt-3 font-display text-lg leading-snug text-(--color-ink-900)">
                  {a.title}
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-(--color-brand-700) opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more
                  <Icon name="arrow" className="w-3.5 h-3.5" />
                </div>
              </Link>
            </m.li>
          ))}
        </m.ul>
      </Container>
    </section>
  );
}
