import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { MedicalProcedureSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/schema/Schema";
import { getService } from "@/lib/services";
import { serviceContent } from "@/lib/serviceContent";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/multiple-tooth-extractions");

export default function Page() {
  const service = getService("multiple-tooth-extractions")!;
  const content = serviceContent["multiple-tooth-extractions"];
  return (
    <>
      <ServicePageTemplate
        service={service}
        intro={content.intro}
        benefits={content.benefits}
        process={content.process}
        faq={content.faq}
      />
      <MedicalProcedureSchema name={service.name} description={content.intro} url="/multiple-tooth-extractions" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/dental-services" },
          { name: service.name, url: "/multiple-tooth-extractions" },
        ]}
      />
      {content.faq && <FAQPageSchema faqs={content.faq} />}
    </>
  );
}
