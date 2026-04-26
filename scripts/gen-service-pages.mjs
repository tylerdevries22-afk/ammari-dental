import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "app");

const slugs = [
  "dental-services",
  "comfortable-dentistry",
  "dental-emergencies",
  "teeth-whitening",
  "bonding",
  "tooth-colored-fillings",
  "dental-crowns",
  "bridges",
  "veneers",
  "root-canal",
  "deep-cleaning",
  "preventative-periodontics",
  "night-guards",
  "dental-implants",
  "implant-dentures",
  "dentures",
  "extractions",
  "multiple-tooth-extractions",
];

const tpl = (slug) => `import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { MedicalProcedureSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/schema/Schema";
import { getService } from "@/lib/services";
import { serviceContent } from "@/lib/serviceContent";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/${slug}");

export default function Page() {
  const service = getService("${slug}")!;
  const content = serviceContent["${slug}"];
  return (
    <>
      <ServicePageTemplate
        service={service}
        intro={content.intro}
        benefits={content.benefits}
        process={content.process}
        faq={content.faq}
      />
      <MedicalProcedureSchema name={service.name} description={content.intro} url="/${slug}" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/dental-services" },
          { name: service.name, url: "/${slug}" },
        ]}
      />
      {content.faq && <FAQPageSchema faqs={content.faq} />}
    </>
  );
}
`;

for (const slug of slugs) {
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), tpl(slug));
  console.log("created", slug);
}
