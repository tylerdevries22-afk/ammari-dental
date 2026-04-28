#!/usr/bin/env node
// Second pass: search Wikimedia Commons file namespace by query for the
// remaining carriers that didn't yield a logo from their main Wikipedia page.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "images", "insurance");
mkdirSync(out, { recursive: true });

// Slug → search query for Commons file namespace.
const missing = [
  { slug: "ameritas",         q: "Ameritas logo" },
  { slug: "careington",       q: "Careington logo" },
  { slug: "chpplus",          q: "Child Health Plan Plus logo" },
  { slug: "cigna",            q: "Cigna logo" },
  { slug: "dentemax",         q: "DenteMax logo" },
  { slug: "guardian",         q: "Guardian Life Insurance logo" },
  { slug: "liberty-dental",   q: "Liberty Dental Plan logo" },
  { slug: "lincoln",          q: "Lincoln Financial logo" },
  { slug: "dentaquest",       q: "DentaQuest logo" },
  { slug: "united-concordia", q: "United Concordia logo" },
];

const UA = "AmmariDentalLogoFetcher/1.0 (contact: tylerdevries22@gmail.com)";

async function commonsSearch(query) {
  // Search File: namespace on Commons.
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("srnamespace", "6"); // File:
  url.searchParams.set("srlimit", "10");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const j = await r.json();
  return (j.query?.search || []).map((s) => s.title);
}

async function imageInfo(fileTitle, host = "commons.wikimedia.org") {
  const url = new URL(`https://${host}/w/api.php`);
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", fileTitle);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const j = await r.json();
  return j.query?.pages?.[0]?.imageinfo?.[0] || null;
}

async function enWikipediaSearch(query) {
  // Some logos live only on en.wikipedia (fair-use uploads, not on Commons).
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", `${query} prefix:File:`);
  url.searchParams.set("srnamespace", "6");
  url.searchParams.set("srlimit", "10");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const j = await r.json();
  return (j.query?.search || []).map((s) => s.title);
}

function pick(titles, queryWords) {
  // Score: must contain "logo", prefer SVG, prefer titles whose token overlap
  // with queryWords is highest, prefer shorter file names.
  const lowerWords = queryWords.toLowerCase().split(/\s+/);
  const scored = titles
    .filter((t) => /logo/i.test(t))
    .map((t) => {
      const lower = t.toLowerCase();
      const overlap = lowerWords.filter((w) => lower.includes(w)).length;
      const isSvg = lower.endsWith(".svg") ? 1 : 0;
      return { t, overlap, isSvg, len: t.length };
    });
  scored.sort((a, b) =>
    b.overlap - a.overlap ||
    b.isSvg - a.isSvg ||
    a.len - b.len,
  );
  return scored[0]?.t || null;
}

async function downloadTo(url, destPath) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`download ${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(destPath, buf);
  return buf.length;
}

const results = [];
for (const m of missing) {
  try {
    let titles = await commonsSearch(m.q);
    let pickedTitle = pick(titles, m.q);
    let host = "commons.wikimedia.org";
    if (!pickedTitle) {
      titles = await enWikipediaSearch(m.q);
      pickedTitle = pick(titles, m.q);
      host = "en.wikipedia.org";
    }
    if (!pickedTitle) {
      results.push({ slug: m.slug, status: "not-found", q: m.q });
      continue;
    }
    const info = await imageInfo(pickedTitle, host);
    if (!info?.url) {
      results.push({ slug: m.slug, status: "no-imageinfo", file: pickedTitle });
      continue;
    }
    const ext = extname(new URL(info.url).pathname).toLowerCase() || ".png";
    const dest = resolve(out, `${m.slug}${ext}`);
    const bytes = await downloadTo(info.url, dest);
    results.push({ slug: m.slug, status: "ok", file: pickedTitle, ext, bytes, url: info.url });
  } catch (err) {
    results.push({ slug: m.slug, status: "error", error: String(err) });
  }
}
console.log(JSON.stringify(results, null, 2));
