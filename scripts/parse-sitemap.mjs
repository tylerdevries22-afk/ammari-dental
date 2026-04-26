import { readFileSync, writeFileSync } from "node:fs";

const xml = readFileSync("/tmp/ammari-sitemap.xml", "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const articles = [];
const others = [];

for (const u of urls) {
  const path = u.replace("https://www.auroragentledentist.com", "");
  if (path.startsWith("/articles/")) articles.push(path);
  else others.push(path);
}

console.log("Total URLs:", urls.length);
console.log("Article URLs:", articles.length);
console.log("Other URLs:", others.length);

// Group articles by collection
const collections = {};
for (const a of articles) {
  const parts = a.split("/").filter(Boolean); // articles/<collection>/<slug>
  const collection = parts[1];
  const slug = parts.slice(2).join("/");
  if (!collections[collection]) collections[collection] = [];
  collections[collection].push(slug);
}

console.log("\nCollections:");
for (const c of Object.keys(collections)) {
  console.log(`  ${c}: ${collections[c].length}`);
}

writeFileSync(
  "lib/legacyUrls.json",
  JSON.stringify(
    {
      total: urls.length,
      articles,
      others,
      collections,
    },
    null,
    2,
  ),
);
console.log("\nWrote lib/legacyUrls.json");
