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
        title="Meet the Doctor & Staff"
        description="Friendly, experienced, and patient-focused — meet the people behind Ammari Dental."
        url="/dental-staff"
      >
        <h2>Dr. Raed Ammari, DDS</h2>
        <p>
          Dr. Ammari has cared for Aurora families for over two decades. He
          believes great dentistry begins with listening, and his gentle,
          communicative approach has earned the trust of generations of
          patients. Outside the office he enjoys spending time with family and
          giving back to the local community.
        </p>
        <h2>Dr. Sarah Green, DDS</h2>
        <p>
          Dr. Green brings warmth, precision, and a calm chairside manner to
          every visit. She treats both general and cosmetic cases — from a
          first cleaning for a young patient to full smile makeovers — and
          patients consistently mention how thoroughly she explains every
          option before treatment begins.
        </p>
        <h2>The Team</h2>
        <p>
          Behind every comfortable visit is a team that genuinely cares.
          Danielle Harris keeps the office running as our Office Manager,
          handling insurance, scheduling, and treatment coordination so you
          never have to wonder where things stand. Lisa Dawson, our
          Administrative Assistant, is often the first friendly voice
          you&rsquo;ll hear and helps every new patient get started smoothly.
          Together with our hygienists and dental assistants, they make
          Ammari Dental feel less like a dental office and more like a
          neighborhood you keep coming back to.
        </p>
      </InfoPage>
      <StaffStrip showBio />
      <CTABanner />
    </>
  );
}
