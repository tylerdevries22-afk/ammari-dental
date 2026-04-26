import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Icon } from "@/components/ui/Icon";
import { BreadcrumbSchema } from "@/components/schema/Schema";
import {
  collections,
  articlesByCollection,
  collectionLabel,
} from "@/lib/articles";

type Params = { collection: string };

export async function generateStaticParams(): Promise<Params[]> {
  return collections.map((collection) => ({ collection }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { collection } = await params;
  if (!collections.includes(collection)) return {};
  const label = collectionLabel(collection);
  return {
    title: `${label} Articles | Ammari Dental | Aurora, CO`,
    description: `Patient education library — ${label}. Articles reviewed by Dr. Raed Ammari, DDS at Ammari Dental in Aurora, CO.`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { collection } = await params;
  if (!collections.includes(collection)) return notFound();

  const items = articlesByCollection(collection);
  const label = collectionLabel(collection);

  // Group by topic
  const grouped: Record<string, typeof items> = {};
  for (const a of items) {
    if (!grouped[a.topic]) grouped[a.topic] = [];
    grouped[a.topic].push(a);
  }

  return (
    <>
      <PageHero
        eyebrow="Patient education"
        title={label}
        description={`Read about helpful topics in ${label.toLowerCase()}, reviewed by Dr. Raed Ammari, DDS.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Patient Education" },
          { label },
        ]}
      />
      <section className="pb-24">
        <Container>
          {Object.keys(grouped).sort().map((topic) => (
            <div key={topic} className="mb-16">
              <h2 className="text-2xl lg:text-3xl font-display tracking-tight mb-6">{topic}</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[topic].map((a) => (
                  <li key={a.url}>
                    <Link
                      href={a.url}
                      className="group block h-full p-5 rounded-2xl bg-white border border-[--color-brand-100] hover:border-[--color-brand-400] transition-all hover:-translate-y-1 hover:shadow-[--shadow-soft-sm]"
                    >
                      <div className="font-display text-base leading-snug">{a.title}</div>
                      <div className="mt-3 text-xs font-semibold text-[--color-brand-700] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <Icon name="arrow" className="w-3 h-3" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>
      <CTABanner />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Patient Education", url: `/articles/${collection}` },
          { name: label, url: `/articles/${collection}` },
        ]}
      />
    </>
  );
}
