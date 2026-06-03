import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { ByTheNumbers } from "@/components/sections/ByTheNumbers";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { EmergencyBand } from "@/components/sections/EmergencyBand";
import { AboutSplit } from "@/components/sections/AboutSplit";
import { ClinicalTeam } from "@/components/sections/ClinicalTeam";
import { SmilesStrip } from "@/components/sections/SmilesStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";
import { StaffStrip } from "@/components/sections/StaffStrip";
import { ArticlesGrid } from "@/components/sections/ArticlesGrid";
import { LocationHours } from "@/components/sections/LocationHours";
import { CTABanner } from "@/components/sections/CTABanner";
import { ParallaxGallery } from "@/components/sections/ParallaxGallery";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SectionDivider } from "@/components/ui/SectionDivider";
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

      {/* HOOK — hero + an instant reassurance bar, read as one unit (tone A). */}
      <Hero />
      <TrustStrip />

      {/* WARMTH — the faces of real Aurora neighbors lead the page. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" />
      <SmilesStrip />

      {/* HARD TRUST — two decades, measured. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <ByTheNumbers />

      {/* COMFORT — the calm, easy-to-visit space. */}
      <SectionDivider variant="arc" fillToken="--color-surface-warm" />
      <ParallaxGallery />

      {/* THE OFFER — everything we do. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <ServiceGrid showAll heading="Our Services" />

      {/* RELATIONSHIP — the doctor, the standard, and the team, contiguous. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" />
      <AboutSplit />
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <ClinicalTeam />
      <SectionDivider variant="wave" fillToken="--color-surface-warm" />
      <StaffStrip />

      {/* HARD PROOF — verbatim reviews + the aggregate Google rating. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <Testimonials />

      {/* REMOVE FRICTION — cost. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" />
      <InsuranceMarquee />

      {/* ACT NOW — urgent-care punctuation. */}
      <SectionDivider variant="arc" fillToken="--color-surface-warm" position="top" />
      <EmergencyBand />

      {/* CONVERT — the primary appointment request. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" />
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

      {/* LOGISTICS — where and when. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <LocationHours />

      {/* CLOSER — final dark CTA. */}
      <SectionDivider variant="arc" fillToken="--color-surface-warm" />
      <CTABanner title="Welcoming new patients" description="Book an appointment in minutes." />

      {/* LEARN (coda) — patient education, out of the conversion path. */}
      <SectionDivider variant="wave" fillToken="--color-surface-warm" position="top" />
      <ArticlesGrid />
    </>
  );
}
