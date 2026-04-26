import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/links");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Resources"
      title="Helpful Links"
      description="Trusted oral health resources from around the web."
      url="/links"
    >
      <ul>
        <li>American Dental Association — ada.org</li>
        <li>Colorado Dental Association — cdaonline.org</li>
        <li>Mouth Healthy by ADA — mouthhealthy.org</li>
        <li>CDC Oral Health — cdc.gov/oralhealth</li>
      </ul>
    </InfoPage>
  );
}
