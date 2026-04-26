import type { Metadata } from "next";
import { StaffStrip } from "@/components/sections/StaffStrip";
import { CTABanner } from "@/components/sections/CTABanner";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/dental-staff");

export default function Page() {
  return (
    <>
      <InfoPage
        eyebrow="Our team"
        title="Meet Our Staff"
        description="Friendly, experienced, and patient-focused — meet the team behind Ammari Dental."
        url="/dental-staff"
      >
        <h2>Dr. Raed Ammari, DDS</h2>
        <p>
          Dr. Ammari has cared for Aurora families for over two decades. He
          believes that exceptional dentistry begins with listening, and his
          gentle, communicative approach has earned the trust of generations of
          patients.
        </p>
        <h2>Our Team</h2>
        <p>
          Our front-office team, hygienists, and dental assistants are the heart
          of the practice. Together they make every visit feel calm, organized,
          and welcoming — exactly the way going to the dentist should feel.
        </p>
      </InfoPage>
      <StaffStrip />
      <CTABanner />
    </>
  );
}
