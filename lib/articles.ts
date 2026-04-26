import data from "./articleData.json";

export type Article = {
  collection: string;
  slug: string;
  title: string;
  url: string;
  topic: string;
  service: string;
};

export const articles: Article[] = data.articles;
export const collections: string[] = data.collections;
export const categories: string[] = data.categories;

export function getArticle(collection: string, slug: string): Article | undefined {
  return articles.find((a) => a.collection === collection && a.slug === slug);
}

export function articlesByCollection(collection: string): Article[] {
  return articles.filter((a) => a.collection === collection);
}

export function relatedArticles(article: Article, count = 4): Article[] {
  return articles
    .filter((a) => a !== article && a.topic === article.topic)
    .concat(articles.filter((a) => a.topic !== article.topic && a !== article))
    .slice(0, count);
}

export function collectionLabel(collection: string): string {
  const labels: Record<string, string> = {
    general: "General Dentistry",
    baystone_curated_content: "Curated Content",
    premium_education: "Premium Education",
    ada: "ADA Library",
    dear_doctor_spanish: "Dear Doctor (Español)",
    dear_doctor_biohorizons_education_library: "BioHorizons Library",
    aad_education_library: "AAD Library",
    aohns_patient_education: "AOHNS Education",
    asge_education_library: "ASGE Library",
    acfas: "ACFAS Library",
    officite_aap: "AAP Resources",
  };
  return labels[collection] ?? "Articles";
}
