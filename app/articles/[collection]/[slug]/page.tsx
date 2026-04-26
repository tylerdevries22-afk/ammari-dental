import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "@/components/ArticleTemplate";
import { BreadcrumbSchema } from "@/components/schema/Schema";
import {
  articles,
  getArticle,
  relatedArticles,
  collectionLabel,
} from "@/lib/articles";
import { buildArticleBody } from "@/lib/articleBody";
import { site } from "@/lib/site";

type Params = { collection: string; slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return articles.map((a) => ({ collection: a.collection, slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { collection, slug } = await params;
  const article = getArticle(collection, slug);
  if (!article) return {};
  return {
    title: `${article.title} | ${collectionLabel(article.collection)} | Ammari Dental`,
    description: `${article.title} — patient education from Ammari Dental in Aurora, CO. ${article.topic} reviewed by Dr. Raed Ammari, DDS.`,
    alternates: { canonical: article.url },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { collection, slug } = await params;
  const article = getArticle(collection, slug);
  if (!article) return notFound();

  const related = relatedArticles(article);
  const body = buildArticleBody(article);

  return (
    <>
      <ArticleTemplate article={article} related={related} body={body} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Patient Education", url: `/articles/${collection}` },
          { name: collectionLabel(collection), url: `/articles/${collection}` },
          { name: article.title, url: article.url },
        ]}
      />
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            url: `${site.url}${article.url}`,
            author: { "@type": "Person", name: "Dr. Raed Ammari" },
            publisher: {
              "@type": "Organization",
              name: site.name,
              url: site.url,
            },
            articleSection: article.topic,
          }),
        }}
      />
    </>
  );
}
