import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("lib/legacyUrls.json", "utf8"));

// Strip leading numeric ID + dash, then humanize kebab-case
function titleFromSlug(slug) {
  if (!slug) return "Article";
  const cleaned = slug.replace(/^\d+-/, "");
  return cleaned
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOr\b/g, "or")
    .replace(/\bThe\b/g, "the")
    .replace(/\bOf\b/g, "of")
    .replace(/\bA\b/g, "a")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/Tmj/g, "TMJ")
    .replace(/Hiv/g, "HIV");
}

// Topic mapping for SEO description + related service link
function topicFor(title) {
  const t = title.toLowerCase();
  if (t.includes("crown") || t.includes("bridge")) return { topic: "Restorative", service: "/dental-crowns" };
  if (t.includes("whitening") || t.includes("bleach")) return { topic: "Cosmetic", service: "/teeth-whitening" };
  if (t.includes("veneer")) return { topic: "Cosmetic", service: "/veneers" };
  if (t.includes("bonding")) return { topic: "Cosmetic", service: "/bonding" };
  if (t.includes("implant")) return { topic: "Implants", service: "/dental-implants" };
  if (t.includes("denture")) return { topic: "Restorative", service: "/dentures" };
  if (t.includes("root canal")) return { topic: "Restorative", service: "/root-canal" };
  if (t.includes("filling")) return { topic: "Restorative", service: "/tooth-colored-fillings" };
  if (t.includes("extract") || t.includes("wisdom") || t.includes("tooth removal")) return { topic: "Surgical", service: "/extractions" };
  if (t.includes("emergency") || t.includes("toothache") || t.includes("pain")) return { topic: "Emergency", service: "/dental-emergencies" };
  if (t.includes("gum") || t.includes("periodont") || t.includes("scaling")) return { topic: "Periodontics", service: "/preventative-periodontics" };
  if (t.includes("brush") || t.includes("floss") || t.includes("hygien") || t.includes("plaque") || t.includes("rinse") || t.includes("toothbrush")) return { topic: "Hygiene", service: "/dental-services" };
  if (t.includes("grind") || t.includes("brux") || t.includes("night guard")) return { topic: "Prevention", service: "/night-guards" };
  if (t.includes("cancer") || t.includes("diabetes") || t.includes("nutrition") || t.includes("health") || t.includes("medication") || t.includes("medical")) return { topic: "Health", service: "/dental-services" };
  if (t.includes("orthodont") || t.includes("braces") || t.includes("invisalign")) return { topic: "Orthodontics", service: "/dental-services" };
  if (t.includes("child") || t.includes("kids") || t.includes("teen")) return { topic: "Pediatric", service: "/dental-services" };
  return { topic: "Education", service: "/dental-services" };
}

const articles = [];
const collectionIndexes = new Set();
const categoryIndexes = new Set();

for (const url of data.articles) {
  const parts = url.split("/").filter(Boolean); // e.g. articles, general, 502447-water-picks
  const collection = parts[1];
  if (parts.length === 2) {
    collectionIndexes.add(collection);
  } else if (parts.length === 4 && parts[2] === "category") {
    categoryIndexes.add(`${collection}/${parts[3]}`);
  } else if (parts.length === 3) {
    const slug = parts[2];
    const title = titleFromSlug(slug);
    const meta = topicFor(title);
    articles.push({
      collection,
      slug,
      title,
      url,
      ...meta,
    });
  }
}

writeFileSync(
  "lib/articleData.json",
  JSON.stringify(
    {
      articles,
      collections: [...collectionIndexes].sort(),
      categories: [...categoryIndexes].sort(),
    },
    null,
    2,
  ),
);

console.log("Articles:", articles.length);
console.log("Collection index pages:", collectionIndexes.size);
console.log("Category index pages:", categoryIndexes.size);
console.log("Wrote lib/articleData.json");
