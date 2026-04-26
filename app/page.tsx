import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { EmergencyBand } from "@/components/sections/EmergencyBand";
import { AboutSplit } from "@/components/sections/AboutSplit";
import { Testimonials } from "@/components/sections/Testimonials";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";
import { StaffStrip } from "@/components/sections/StaffStrip";
import { ArticlesGrid } from "@/components/sections/ArticlesGrid";
import { LocationHours } from "@/components/sections/LocationHours";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/");

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServiceGrid />
      <EmergencyBand />
      <AboutSplit />
      <InsuranceMarquee />

      <section className="py-24 lg:py-32 bg-[--color-surface-muted]/40">
        <Container className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Send Us An Email Today"
              title="Appointment Request"
              description="Request a visit and we'll follow up to confirm your time. For urgent care, please call."
              align="left"
            />
          </div>
          <div className="lg:col-span-7">
            <AppointmentForm />
          </div>
        </Container>
      </section>

      <StaffStrip />
      <Testimonials />
      <ArticlesGrid />
      <LocationHours />
      <CTABanner title="Welcoming new patients" description="Book an appointment in minutes." />
    </>
  );
}
