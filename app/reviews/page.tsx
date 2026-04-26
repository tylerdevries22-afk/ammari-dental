import type { Metadata } from "next";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/reviews");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="From our patients"
        title="Reviews"
        description="Read what real patients say about their experience at Ammari Dental."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />
      <Testimonials />
      <CTABanner />
    </>
  );
}
