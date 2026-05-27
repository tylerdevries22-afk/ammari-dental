import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { HeroStoryPinned } from "@/components/sections/HeroStoryPinned";
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
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollHueShift } from "@/components/effects/ScrollHueShift";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { metaFor } from "@/lib/metadata";

// Below-the-fold; defer its react-hook-form + zod chunk past first paint.
// Server-rendered placeholder keeps layout stable.
const AppointmentForm = dynamic(
  () => import("@/components/sections/AppointmentForm").then((m) => m.AppointmentForm),
  {
    loading: () => (
      <div className="h-[480px] rounded-(--radius-xl) bg-(--color-surface) border border-(--color-brand-100) animate-pulse" />
    ),
  },
);

export const metadata: Metadata = metaFor("/");

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <ScrollHueBackground />
      <ScrollHueShift />

      <Hero />
      <HeroStoryPinned />
      <SectionDivider variant="wave" fillToken="--surface-data" />
      <ByTheNumbers />
      <TrustStrip />
      <SectionDivider variant="arc" fillToken="--color-bg" />
      <ParallaxGallery />
      <ServiceGrid />
      <SectionDivider variant="blob" fillToken="--color-bg" />
      <StickyValues />
      <SectionDivider variant="scallop" fillToken="--color-surface-muted" position="top" />
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
