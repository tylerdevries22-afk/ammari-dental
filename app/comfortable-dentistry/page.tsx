import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { MedicalProcedureSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/schema/Schema";
import { getService } from "@/lib/services";
import { serviceContent } from "@/lib/serviceContent";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/comfortable-dentistry");

export default function Page() {
  const service = getService("comfortable-dentistry")!;
  const content = serviceContent["comfortable-dentistry"];
  return (
    <>
      <ServicePageTemplate
        service={service}
        intro={content.intro}
        benefits={content.benefits}
        process={content.process}
        faq={content.faq}
      />
      <MedicalProcedureSchema name={service.name} description={content.intro} url="/comfortable-dentistry" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/dental-services" },
          { name: service.name, url: "/comfortable-dentistry" },
        ]}
      />
      {content.faq && <FAQPageSchema faqs={content.faq} />}
    </>
  );
}
