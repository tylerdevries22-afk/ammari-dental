import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { FAQPageSchema, BreadcrumbSchema } from "@/components/schema/Schema";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/-q---a");

const faqs = [
  {
    q: "What can I do about teeth that are sensitive to hot or cold?",
    a: "Sensitivity often points to thinning enamel, exposed roots, or a small crack. Switching to a desensitizing toothpaste and a soft brush is the first step. If discomfort lingers more than a couple of weeks, schedule a visit so we can identify the cause and treat it directly.",
  },
  {
    q: "What is gingivitis?",
    a: "Gingivitis is the earliest stage of gum disease — gums become red, puffy, and bleed easily during brushing. Caught early, it's reversible with a professional cleaning and consistent home care. Left alone, it can progress to periodontal disease.",
  },
  {
    q: "What is periodontal (gum) disease?",
    a: "Periodontal disease is a deeper infection that affects the tissue and bone supporting your teeth. We treat it with deep cleanings (scaling and root planing), targeted antibiotic therapy, and a maintenance schedule designed to keep it from coming back.",
  },
  {
    q: "What's the difference between white and silver fillings?",
    a: "Silver (amalgam) fillings have been used for decades and are durable, but they look obviously dark and can expand over time. Tooth-colored composite fillings bond directly to the tooth, conserve more healthy structure, and blend in so naturally that most people can't tell where the filling ends.",
  },
  {
    q: "How can I improve my smile?",
    a: "It depends on what bothers you. Whitening tackles staining, bonding fixes small chips and gaps, veneers reshape the front teeth, and crowns rebuild teeth that have lost structure. We start with a free smile consultation to map out the simplest path to the result you want.",
  },
  {
    q: "How does teeth whitening work?",
    a: "Whitening uses a peroxide-based gel that breaks up stain molecules inside the enamel. We offer in-office treatment for fast results and custom take-home trays for gradual whitening you control. Both are safe under our supervision and far more effective than over-the-counter strips.",
  },
  {
    q: "What is dental bonding?",
    a: "Bonding uses a tooth-colored composite resin to repair small chips, close minor gaps, or reshape a tooth. It's typically done in a single visit, requires very little (or no) drilling, and is one of the most affordable cosmetic options.",
  },
  {
    q: "What are porcelain veneers?",
    a: "Veneers are thin shells of porcelain bonded to the front of your teeth. They correct color, shape, length, and minor alignment issues at the same time. Porcelain reflects light the way enamel does, which is why veneers look so natural.",
  },
  {
    q: "What is a dental crown?",
    a: "A crown is a custom cap that covers a tooth from the gumline up. We use crowns to restore teeth that are cracked, heavily filled, root-canal-treated, or worn down. Modern porcelain and zirconia crowns are strong, color-matched, and built to last.",
  },
  {
    q: "What is a dental implant?",
    a: "An implant is a small titanium post placed in the jaw to replace the root of a missing tooth. Once it integrates with the bone, we attach a crown, bridge, or denture to it. Implants are the closest thing modern dentistry offers to a natural tooth.",
  },
  {
    q: "Am I a candidate for dental implants?",
    a: "Most healthy adults with adequate bone are good candidates. We evaluate your bone with a 3D scan, review your medical history, and discuss any habits — like smoking — that could affect healing. If bone is thin, grafting can rebuild the foundation before placement.",
  },
  {
    q: "How long does an implant last?",
    a: "With good hygiene and routine checkups, the implant itself can last for decades — often a lifetime. The crown on top is more like a regular crown and may eventually need replacement, similar to any other dental restoration.",
  },
  {
    q: "Does implant placement hurt?",
    a: "The procedure itself is done under local anesthesia and is usually more comfortable than patients expect. Most people manage post-op soreness with over-the-counter pain relievers for a day or two.",
  },
  {
    q: "How long does the implant process take?",
    a: "From start to finish it's typically three to six months. The longest part is letting the implant fuse with your bone — that healing window is what makes the final result so stable.",
  },
  {
    q: "Will my insurance cover implants?",
    a: "Coverage varies. Many plans now cover part of the implant, abutment, or crown, especially when the tooth was lost recently. We'll do a complimentary benefits check and walk you through the numbers before any work begins.",
  },
  {
    q: "How much do implants cost?",
    a: "Cost depends on the number of teeth being replaced, whether bone grafting is needed, and the type of restoration on top. We provide a written treatment plan with itemized fees so there are no surprises, and we offer financing for almost every budget.",
  },
  {
    q: "What financing options do you offer?",
    a: "We work with CareCredit and offer several no-interest and low-interest plans depending on the treatment cost. Our team will help you apply and choose the option that fits your monthly budget.",
  },
  {
    q: "Do you accept new patients and most insurance?",
    a: "Yes — we welcome new patients of all ages and accept most major dental insurance plans. If you're not sure whether we're in network with yours, give us a call and we'll check before your visit.",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Common questions"
        title="Q & A"
        description="Real answers to the questions we hear most often. If yours isn't here, just call — we're happy to help."
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
