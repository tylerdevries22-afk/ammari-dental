import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const pages = [
  {
    slug: "before-anesthesia",
    title: "Before Anesthesia",
    eyebrow: "Pre-op instructions",
    description: "Important guidelines to follow in the hours leading up to anesthesia.",
    content: `
      <p>To ensure your safety and comfort during sedation, please follow these guidelines.</p>
      <h2>Eating &amp; Drinking</h2>
      <ul>
        <li>Do not eat or drink for at least 6 hours before your appointment.</li>
        <li>Take prescribed medications with a small sip of water unless otherwise directed.</li>
      </ul>
      <h2>Day-of</h2>
      <ul>
        <li>Wear loose, comfortable clothing.</li>
        <li>Bring a responsible adult to drive you home.</li>
        <li>Avoid alcohol for 24 hours before your visit.</li>
      </ul>
    `,
  },
  {
    slug: "surgical-instructions",
    title: "Surgical Instructions",
    eyebrow: "Procedure prep",
    description: "What to expect before and after dental surgery.",
    content: `
      <h2>Before Surgery</h2>
      <ul>
        <li>Get a good night's rest.</li>
        <li>Eat a light meal unless instructed otherwise.</li>
        <li>Take any pre-medications as prescribed.</li>
      </ul>
      <h2>After Surgery</h2>
      <ul>
        <li>Bite gently on gauze for 30–45 minutes.</li>
        <li>Apply ice to reduce swelling.</li>
        <li>Stick to soft foods for 24 hours.</li>
        <li>Avoid using a straw or smoking.</li>
      </ul>
    `,
  },
  {
    slug: "after-dental-implant-surgery",
    title: "After Dental Implant Surgery",
    eyebrow: "Recovery",
    description: "Care instructions to ensure successful implant healing.",
    content: `
      <h2>The First 24 Hours</h2>
      <ul>
        <li>Rest and avoid strenuous activity.</li>
        <li>Apply ice to the cheek for 20-minute intervals.</li>
        <li>Keep your head elevated when lying down.</li>
      </ul>
      <h2>The First Week</h2>
      <ul>
        <li>Eat soft foods.</li>
        <li>Brush carefully, avoiding the surgical site.</li>
        <li>Rinse gently with warm salt water after meals.</li>
      </ul>
      <p>If you have severe pain, swelling, or bleeding, call (303) 283-8009.</p>
    `,
  },
  {
    slug: "after-impacted-tooth",
    title: "After Impacted Tooth Removal",
    eyebrow: "Recovery",
    description: "Care after removal of an impacted tooth.",
    content: `
      <h2>Bleeding</h2>
      <p>Bite firmly on gauze for 30–45 minutes. Replace as needed.</p>
      <h2>Swelling</h2>
      <p>Apply ice in 20-minute intervals for the first 24 hours.</p>
      <h2>Eating</h2>
      <p>Soft foods only for the first 24–48 hours. Avoid hot liquids.</p>
    `,
  },
  {
    slug: "after-wisdom-tooth-removal",
    title: "After Wisdom Tooth Removal",
    eyebrow: "Recovery",
    description: "Care after wisdom tooth extraction.",
    content: `
      <h2>The First Day</h2>
      <ul>
        <li>Rest and keep your head elevated.</li>
        <li>Bite on gauze to control bleeding.</li>
        <li>Apply ice for 20 minutes on, 20 off.</li>
      </ul>
      <h2>Days 2–7</h2>
      <ul>
        <li>Begin gentle warm salt water rinses.</li>
        <li>Eat soft foods and drink plenty of water.</li>
        <li>Avoid straws, smoking, and strenuous activity.</li>
      </ul>
    `,
  },
  {
    slug: "post-op-instructions",
    title: "Post-Op Instructions",
    eyebrow: "After your visit",
    description: "General post-operative care instructions for our patients.",
    content: `
      <p>Following your treatment, please follow these general guidelines for the best recovery.</p>
      <ul>
        <li>Take medications as prescribed.</li>
        <li>Avoid hot, hard, or crunchy foods for the first 24 hours.</li>
        <li>Maintain gentle oral hygiene.</li>
        <li>Call us with any questions or concerns.</li>
      </ul>
      <p>For specific procedures see:
        <a href="/after-dental-implant-surgery">After Implants</a>,{' '}
        <a href="/after-wisdom-tooth-removal">After Wisdom Teeth</a>,{' '}
        <a href="/after-impacted-tooth">After Impacted Tooth</a>.
      </p>
    `,
  },
];

const tpl = (p) => `import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/${p.slug}");

export default function Page() {
  return (
    <InfoPage
      eyebrow="${p.eyebrow}"
      title="${p.title}"
      description="${p.description}"
      url="/${p.slug}"
    >
      <div dangerouslySetInnerHTML={{ __html: \`${p.content.replace(/`/g, "\\`").replace(/\\\\/g, "\\\\")}\` }} />
    </InfoPage>
  );
}
`;

for (const p of pages) {
  const dir = join(process.cwd(), "app", p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), tpl(p));
  console.log("created", p.slug);
}
