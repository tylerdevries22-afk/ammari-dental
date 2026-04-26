import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { articles, collections } from "@/lib/articles";
import data from "@/lib/articleData.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/appointment",
    "/contact",
    "/new-patients",
    "/-new-patient-forms",
    "/our-dental-office-location",
    "/dental-staff",
    "/gallery",
    "/reviews",
    "/testimonials",
    "/financing",
    "/-improving-your-smile",
    "/-q---a",
    "/educational-videos",
    "/links",
    "/privacy",
    "/notice-of-non-discrimination",
    "/before-anesthesia",
    "/surgical-instructions",
    "/after-dental-implant-surgery",
    "/after-impacted-tooth",
    "/after-wisdom-tooth-removal",
    "/post-op-instructions",
  ];

  const serviceRoutes = services.map((s) => `/${s.slug}`);
  const collectionRoutes = collections.map((c) => `/articles/${c}`);
  const articleRoutes = articles.map((a) => a.url);
  const categoryRoutes = (data.categories as string[]).map((c) => `/articles/${c.split("/")[0]}/category/${c.split("/")[1]}`);

  const all = [
    ...staticRoutes,
    ...serviceRoutes,
    ...collectionRoutes,
    ...articleRoutes,
    ...categoryRoutes,
  ];

  return all.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority:
      path === ""
        ? 1
        : path.startsWith("/articles/")
          ? 0.5
          : path.startsWith("/dental") || path === "/appointment"
            ? 0.9
            : 0.7,
  }));
}
