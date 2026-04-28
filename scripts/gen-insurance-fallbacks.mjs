// Regenerate monogram SVG fallbacks for carriers without authentic logos
// available from Wikimedia. Only writes the listed slugs.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "images", "insurance");
mkdirSync(out, { recursive: true });

const fallbacks = [
  { slug: "ameritas",       mono: "Am", label: "Ameritas",       bg: "#003B71" },
  { slug: "careington",     mono: "Cr", label: "Careington",     bg: "#E25C26" },
  { slug: "chpplus",        mono: "C+", label: "CHP+",           bg: "#0E7C66" },
  { slug: "dentaquest",     mono: "Dq", label: "DentaQuest",     bg: "#008996" },
  { slug: "dentemax",       mono: "Dx", label: "DenteMax",       bg: "#0072BC" },
  { slug: "liberty-dental", mono: "Lb", label: "Liberty Dental", bg: "#1B4F8A" },
  { slug: "lincoln",        mono: "Ln", label: "Lincoln",        bg: "#003366" },
];

const W = 120;
const H = 120;
const fontSize = (m) => (m.length <= 1 ? 56 : m.length === 2 ? 44 : 32);

for (const { slug, mono, label, bg } of fallbacks) {
  const fs = fontSize(mono);
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
console.log(`Wrote ${fallbacks.length} fallback badges`);
