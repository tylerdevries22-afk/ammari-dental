import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "images", "insurance");
mkdirSync(out, { recursive: true });

// Each entry: slug, monogram (1-3 chars), label (full short name), bg (brand color)
const items = [
  { slug: "aetna",            mono: "Æ",   label: "Aetna",            bg: "#7B1FA2" },
  { slug: "ameritas",         mono: "Am",  label: "Ameritas",         bg: "#003B71" },
  { slug: "anthem",           mono: "A+",  label: "Anthem BCBS",      bg: "#0066B3" },
  { slug: "assurant",         mono: "As",  label: "Assurant",         bg: "#002F87" },
  { slug: "careington",       mono: "Cr",  label: "Careington",       bg: "#E25C26" },
  { slug: "chpplus",          mono: "C+",  label: "CHP+",             bg: "#0E7C66" },
  { slug: "cigna",            mono: "Ci",  label: "Cigna",            bg: "#E18119" },
  { slug: "delta-dental",     mono: "Δ",   label: "Delta Dental",     bg: "#00549F" },
  { slug: "dentemax",         mono: "Dx",  label: "DenteMax",         bg: "#0072BC" },
  { slug: "geha",             mono: "Ge",  label: "GEHA",             bg: "#007A87" },
  { slug: "guardian",         mono: "Gu",  label: "Guardian",         bg: "#002F6C" },
  { slug: "humana",           mono: "Hu",  label: "Humana",           bg: "#6CB33F" },
  { slug: "liberty-dental",   mono: "Lb",  label: "Liberty Dental",   bg: "#1B4F8A" },
  { slug: "lincoln",          mono: "Ln",  label: "Lincoln Financial",bg: "#003366" },
  { slug: "dentaquest",       mono: "Dq",  label: "Medicaid · DQ",    bg: "#008996" },
  { slug: "metlife",          mono: "ML",  label: "MetLife",          bg: "#0061A0" },
  { slug: "principal",        mono: "Pr",  label: "Principal",        bg: "#0091DA" },
  { slug: "sunlife",          mono: "Sun", label: "Sun Life",         bg: "#C8A415" },
  { slug: "united-concordia", mono: "UC",  label: "United Concordia", bg: "#7A1F2B" },
  { slug: "united-healthcare",mono: "UH",  label: "UnitedHealthcare", bg: "#002677" },
];

// Determine font size based on monogram length so it fills nicely.
function fontSizeFor(mono) {
  if (mono.length <= 1) return 56;
  if (mono.length === 2) return 44;
  return 32;
}

const W = 120;
const H = 120;

for (const { slug, mono, label, bg } of items) {
  const fs = fontSizeFor(mono);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="${(W - 4) / 2}" ry="${(H - 4) / 2}" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, sans-serif" font-weight="700" font-size="${fs}" fill="#ffffff" letter-spacing="-0.5">${mono}</text>
</svg>
`;
  writeFileSync(resolve(out, `${slug}.svg`), svg, "utf8");
}

console.log(`Wrote ${items.length} SVG badges to ${out}`);
