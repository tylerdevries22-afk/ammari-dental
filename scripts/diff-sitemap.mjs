import { readFileSync, existsSync } from "node:fs";

const SNAP = "legacy-seo-snapshot.json";
const SITEMAP = ".next/server/app/sitemap.xml.body";

if (!existsSync(SNAP)) {
  console.error(`Missing ${SNAP} — run scripts/build-seo-snapshot.mjs.`);
  process.exit(1);
}

const snapshot = JSON.parse(readFileSync(SNAP, "utf8"));

let live;
try {
  const xml = readFileSync(SITEMAP, "utf8");
  live = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, "") || "/",
  );
} catch (err) {
  console.error(`Could not read built sitemap at ${SITEMAP}. Run "next build" first.`);
  console.error(err.message);
  process.exit(1);
}

const liveSet = new Set(live);
const missing = snapshot.urls.filter((u) => !liveSet.has(u));

if (missing.length === 0) {
  console.log(`All ${snapshot.urls.length} legacy URLs present in current sitemap.`);
  process.exit(0);
}

console.error(`Sitemap regression — ${missing.length}/${snapshot.urls.length} legacy URLs missing:`);
for (const u of missing.slice(0, 50)) console.error(`  - ${u}`);
if (missing.length > 50) console.error(`  ... and ${missing.length - 50} more`);
process.exit(1);
