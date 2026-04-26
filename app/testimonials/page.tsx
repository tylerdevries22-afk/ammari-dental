import type { Metadata } from "next";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/testimonials");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="What our clients say about us"
        title="Testimonials"
        description="Trusted by Aurora families for two decades."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />
      <Testimonials />
      <CTABanner />
    </>
  );
}
