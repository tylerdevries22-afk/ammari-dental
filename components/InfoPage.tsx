import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { BreadcrumbSchema } from "@/components/schema/Schema";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  url: string;
  breadcrumbs?: { label: string; href?: string; name?: string }[];
  /** Full-bleed section rendered between the page hero and the article body. */
  lead?: ReactNode;
  children: ReactNode;
};

export function InfoPage({ eyebrow, title, description, url, breadcrumbs, lead, children }: Props) {
  const crumbs = breadcrumbs ?? [
    { label: "Home", href: "/" },
    { label: title },
  ];
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={crumbs}
      />
      {lead}
      <section className="pb-24">
        <Container className="max-w-4xl">
          <article className="prose prose-lg max-w-none [&_h2]:font-display [&_h2]:tracking-tight [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-(--color-ink-700) [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-(--color-ink-700) [&_a]:text-(--color-brand-700) [&_a]:underline">
            {children}
          </article>
        </Container>
      </section>
      <CTABanner />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: title, url },
        ]}
      />
    </>
  );
}
