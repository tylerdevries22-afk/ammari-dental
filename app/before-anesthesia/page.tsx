import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/before-anesthesia");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Pre-op instructions"
      title="Before Anesthesia"
      description="Important guidelines to follow in the hours leading up to anesthesia."
      url="/before-anesthesia"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <p>To ensure your safety and comfort during sedation, please follow these guidelines.</p>
      <h2>Eating &amp; Drinking</h2>
      <ul>
        <li>Do not eat or drink for at least 6 hours before your appointment.</li>
        <li>Take prescribed medications with a small sip of water unless otherwise directed.</li>
      </ul>
      <h2>Day-of</h2>
      <ul>
        <li>Wear loose, comfortable clothing.</li>
        <li>Bring a responsible adult to drive you home.</li>
        <li>Avoid alcohol for 24 hours before your visit.</li>
      </ul>
    ` }} />
    </InfoPage>
  );
}
