#!/usr/bin/env node
// Fetch official insurance logos from Wikipedia/Commons.
// Strategy: for each carrier, query the carrier's Wikipedia article for any
// File:* image whose title contains "logo", then call imageinfo to resolve
// the actual file URL, and download.
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "images", "insurance");
mkdirSync(out, { recursive: true });

const carriers = [
  { slug: "aetna",            wiki: "Aetna" },
  { slug: "ameritas",         wiki: "Ameritas" },
  { slug: "anthem",           wiki: "Elevance_Health" },
  { slug: "assurant",         wiki: "Assurant" },
  { slug: "careington",       wiki: "Careington" },
  { slug: "chpplus",          wiki: "Child_Health_Plan_Plus" },
  { slug: "cigna",            wiki: "Cigna" },
  { slug: "delta-dental",     wiki: "Delta_Dental" },
  { slug: "dentemax",         wiki: "DenteMax" },
  { slug: "geha",             wiki: "GEHA" },
  { slug: "guardian",         wiki: "Guardian_Life_Insurance_Company_of_America" },
  { slug: "humana",           wiki: "Humana" },
  { slug: "liberty-dental",   wiki: "Liberty_Dental_Plan" },
  { slug: "lincoln",          wiki: "Lincoln_Financial_Group" },
  { slug: "dentaquest",       wiki: "DentaQuest" },
  { slug: "metlife",          wiki: "MetLife" },
  { slug: "principal",        wiki: "Principal_Financial_Group" },
  { slug: "sunlife",          wiki: "Sun_Life_Financial" },
  { slug: "united-concordia", wiki: "United_Concordia" },
  { slug: "united-healthcare",wiki: "UnitedHealth_Group" },
];

const UA = "AmmariDentalLogoFetcher/1.0 (contact: tylerdevries22@gmail.com)";

async function api(params) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function listImages(title) {
  const j = await api({
    action: "query",
    titles: title,
    prop: "images",
    imlimit: "100",
  });
  const page = j.query?.pages?.[0];
  if (!page || page.missing) return [];
  return (page.images || []).map((x) => x.title);
}

async function imageInfo(fileTitle) {
  const j = await api({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|mime",
  });
  const info = j.query?.pages?.[0]?.imageinfo?.[0];
  return info || null;
}

function pickLogoCandidate(images) {
  // Score images: prefer ones that look like clean wordmark logos.
  const candidates = images
    .filter((t) => /logo/i.test(t))
    .filter((t) => !/commons-logo/i.test(t))
    .filter((t) => !/wikidata/i.test(t))
    .filter((t) => !/wikimedia/i.test(t));

  // Prefer SVG over raster.
  candidates.sort((a, b) => {
    const av = a.toLowerCase().endsWith(".svg") ? 0 : 1;
    const bv = b.toLowerCase().endsWith(".svg") ? 0 : 1;
    if (av !== bv) return av - bv;
    // Prefer shorter titles (more likely the main logo).
    return a.length - b.length;
  });
  return candidates[0] || null;
}

async function downloadTo(url, destPath) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`download ${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(destPath, buf);
  return buf.length;
}

const results = [];
for (const c of carriers) {
  try {
    const images = await listImages(c.wiki);
    const cand = pickLogoCandidate(images);
    if (!cand) {
      results.push({ slug: c.slug, status: "no-logo-found", wiki: c.wiki });
      continue;
    }
    const info = await imageInfo(cand);
    if (!info?.url) {
      results.push({ slug: c.slug, status: "no-imageinfo", file: cand });
      continue;
    }
    const ext = extname(new URL(info.url).pathname).toLowerCase() || ".png";
    const dest = resolve(out, `${c.slug}${ext}`);
    const bytes = await downloadTo(info.url, dest);
    results.push({ slug: c.slug, status: "ok", file: cand, ext, bytes, url: info.url });
  } catch (err) {
    results.push({ slug: c.slug, status: "error", error: String(err) });
  }
}

console.log(JSON.stringify(results, null, 2));
