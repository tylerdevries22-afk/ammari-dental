import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ByTheNumbers } from "@/components/sections/ByTheNumbers";
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
import { ParallaxGallery } from "@/components/sections/ParallaxGallery";
import { StickyValues } from "@/components/sections/StickyValues";
import { ScrollHueBackground } from "@/components/sections/ScrollHueBackground";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Container } from "@/components/ui/Container";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/");

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <ScrollHueBackground />

      <Hero />
      <ByTheNumbers />
      <TrustStrip />
      <ParallaxGallery />
      <ServiceGrid />
      <StickyValues />
      <AboutSplit />
      <EmergencyBand />
      <Testimonials />
      <InsuranceMarquee />
      <StaffStrip />
      <ArticlesGrid />

      <section className="py-24 lg:py-32 bg-(--color-surface-warm)">
        <Container className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Send us a note"
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

      <LocationHours />
      <CTABanner title="Welcoming new patients" description="Book an appointment in minutes." />
    </>
  );
}
