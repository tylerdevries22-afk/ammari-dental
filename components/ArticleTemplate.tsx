"use client";
import Link from "next/link";
import { m, useScroll, useSpring } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CTABanner } from "@/components/sections/CTABanner";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { collectionLabel, type Article } from "@/lib/articles";

type Props = {
  article: Article;
  related: Article[];
  body: { heading?: string; paragraphs: string[] }[];
};

export function ArticleTemplate({ article, related, body }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      <m.div
        style={{ scaleX }}
        className="fixed top-[72px] left-0 right-0 h-[2px] bg-(--color-brand-600) origin-left z-40"
        aria-hidden
      />

      <article className="pt-[88px] pb-12 lg:pt-32">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Patient Education", href: `/articles/${article.collection}` },
              { label: collectionLabel(article.collection), href: `/articles/${article.collection}` },
              { label: article.title },
            ]}
          />
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            <div className="eyebrow">{article.topic}</div>
            <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-display tracking-tight leading-[1.05]">
              {article.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-(--color-ink-500)">
              <span>Patient education</span>
              <span aria-hidden>·</span>
              <span>Reviewed by Dr. Raed Ammari, DDS</span>
            </div>
          </m.div>
        </Container>

        <Container className="max-w-3xl mt-10 lg:mt-14">
          <m.div
            variants={stagger(0.06)}
            initial={reveal.initial}
            whileInView={reveal.whileInView}
            viewport={reveal.viewport}
            className="prose prose-lg max-w-none [&_h2]:font-display [&_h2]:tracking-tight [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:text-(--color-ink-700) [&_p]:leading-[1.75] [&_p]:text-lg"
          >
            {body.map((section, i) => (
              <m.div key={i} variants={fadeUp}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </m.div>
            ))}
          </m.div>

          <div className="mt-12 p-6 rounded-2xl bg-(--color-brand-50) border border-(--color-brand-100)">
            <div className="font-display text-xl">Have questions about {article.title.toLowerCase()}?</div>
            <p className="mt-2 text-sm text-(--color-ink-700)">
              Schedule a visit with Dr. Ammari and our team in Aurora, CO.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/appointment" size="md">Book Appointment</Button>
              <Button href={article.service} variant="secondary" size="md">
                Learn about {article.topic}
              </Button>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="py-20 bg-(--color-surface-muted)/40">
          <Container className="max-w-5xl">
            <h2 className="text-2xl lg:text-3xl font-display tracking-tight">Related Articles</h2>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <li key={r.url}>
                  <Link
                    href={r.url}
                    className="group block h-full p-5 rounded-2xl bg-white border border-(--color-brand-100) hover:border-(--color-brand-400) transition-all hover:-translate-y-1 hover:shadow-(--shadow-soft-sm)"
                  >
                    <div className="text-xs uppercase tracking-widest font-semibold text-(--color-brand-600)">
                      {r.topic}
                    </div>
                    <div className="mt-2 font-display text-base leading-snug">{r.title}</div>
                    <div className="mt-4 text-xs font-semibold text-(--color-brand-700) flex items-center gap-1">
                      Read <Icon name="arrow" className="w-3 h-3" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CTABanner />
    </>
  );
}
