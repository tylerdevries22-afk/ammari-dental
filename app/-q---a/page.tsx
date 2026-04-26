import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQPageSchema, BreadcrumbSchema } from "@/components/schema/Schema";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/-q---a");

const faqs = [
  { q: "Do you accept new patients?", a: "Yes! We're always welcoming new patients of all ages." },
  { q: "What insurance do you accept?", a: "We accept most major plans including Aetna, Delta Dental, Cigna, United Healthcare, Medicaid, and more." },
  { q: "Do you offer emergency dental care?", a: "Yes — we reserve same-day appointments for emergencies. Call (303) 283-8009 right away." },
  { q: "How often should I have a cleaning?", a: "Most patients benefit from professional cleanings every six months. Some need them more often." },
  { q: "Do you treat children?", a: "Absolutely. We see patients of all ages and love treating families." },
  { q: "Do you offer sedation dentistry?", a: "Yes — we have comfort options for nervous patients. Ask us at your consultation." },
  { q: "What languages does the team speak?", a: "Our team speaks English, Arabic, and Spanish." },
  { q: "How can I pay for treatment?", a: "We accept insurance, CareCredit, cash, check, and all major credit cards." },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Common questions"
        title="Q & A"
        description="Answers to questions we hear often. Don't see yours? Just call."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Q & A" }]}
      />
      <section className="pb-24">
        <Container className="max-w-4xl">
          <FAQAccordion items={faqs} />
        </Container>
      </section>
      <CTABanner />
      <FAQPageSchema faqs={faqs} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Q & A", url: "/-q---a" }]} />
    </>
  );
}
