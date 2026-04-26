import { readFileSync, writeFileSync, existsSync } from "node:fs";

const xmlPath = "/tmp/ammari-sitemap.xml";
if (!existsSync(xmlPath)) {
  console.error(`Missing ${xmlPath} — fetch sitemap first.`);
  process.exit(1);
}

const xml = readFileSync(xmlPath, "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .map((u) => u.replace("https://www.auroragentledentist.com", ""))
  .map((u) => (u === "" ? "/" : u))
  .sort();

writeFileSync(
  "legacy-seo-snapshot.json",
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      origin: "https://www.auroragentledentist.com",
      total: urls.length,
      urls,
    },
    null,
    2,
  ),
);

console.log(`Wrote legacy-seo-snapshot.json — ${urls.length} URLs`);
