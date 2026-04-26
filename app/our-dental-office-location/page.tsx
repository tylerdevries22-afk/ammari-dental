import type { Metadata } from "next";
import { LocationHours } from "@/components/sections/LocationHours";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/our-dental-office-location");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Find us"
        title="Our Dental Office Location"
        description="Conveniently located in Aurora, just off S Chambers Road. Plenty of parking available."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Location" }]}
      />
      <LocationHours />
      <CTABanner />
    </>
  );
}
