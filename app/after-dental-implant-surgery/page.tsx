import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/after-dental-implant-surgery");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Recovery"
      title="After Dental Implant Surgery"
      description="Care instructions to ensure successful implant healing."
      url="/after-dental-implant-surgery"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <h2>The First 24 Hours</h2>
      <ul>
        <li>Rest and avoid strenuous activity.</li>
        <li>Apply ice to the cheek for 20-minute intervals.</li>
        <li>Keep your head elevated when lying down.</li>
      </ul>
      <h2>The First Week</h2>
      <ul>
        <li>Eat soft foods.</li>
        <li>Brush carefully, avoiding the surgical site.</li>
        <li>Rinse gently with warm salt water after meals.</li>
      </ul>
      <p>If you have severe pain, swelling, or bleeding, call (303) 283-8009.</p>
    ` }} />
    </InfoPage>
  );
}
