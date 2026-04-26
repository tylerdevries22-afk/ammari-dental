import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/lib/articleData.json";
import { collectionLabel, articlesByCollection } from "@/lib/articles";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

type Params = { collection: string; id: string };

export async function generateStaticParams(): Promise<Params[]> {
  return data.categories.map((c) => {
    const [collection, id] = c.split("/");
    return { collection, id };
  });
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { collection } = await params;
  const label = collectionLabel(collection);
  return {
    title: `${label} Category | Ammari Dental | Aurora, CO`,
    description: `Browse ${label} articles by category at Ammari Dental.`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { collection, id } = await params;
  if (!data.categories.includes(`${collection}/${id}`)) return notFound();
  const label = collectionLabel(collection);
  const items = articlesByCollection(collection);

  return (
    <>
      <PageHero
        eyebrow={`Category ${id}`}
        title={`${label} Articles`}
        description="Browse our patient education library by category."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Patient Education" },
          { label, href: `/articles/${collection}` },
          { label: `Category ${id}` },
        ]}
      />
      <section className="pb-24">
        <Container>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 24).map((a) => (
              <li key={a.url}>
                <Link
                  href={a.url}
                  className="group block h-full p-5 rounded-2xl bg-white border border-[--color-brand-100] hover:border-[--color-brand-400] transition-all hover:-translate-y-1 hover:shadow-[--shadow-soft-sm]"
                >
                  <div className="text-xs uppercase tracking-widest font-semibold text-[--color-brand-600]">
                    {a.topic}
                  </div>
                  <div className="mt-2 font-display text-base leading-snug">{a.title}</div>
                  <div className="mt-3 text-xs font-semibold text-[--color-brand-700] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <Icon name="arrow" className="w-3 h-3" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CTABanner />
    </>
  );
}
