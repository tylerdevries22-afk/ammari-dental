import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/-new-patient-forms");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Paperwork"
      title="New Patient Forms"
      description="Download and complete your forms before your first visit to save time."
      url="/-new-patient-forms"
    >
      <p>
        Please print, complete, and bring the following forms to your first
        appointment, or arrive 15 minutes early to fill them out in our office.
      </p>
      <ul>
        <li>Patient information form</li>
        <li>Medical history</li>
        <li>HIPAA acknowledgement</li>
        <li>Insurance authorization</li>
      </ul>
      <p>
        If you have questions, call us at <a href="tel:+13032838009">(303) 283-8009</a>.
      </p>
    </InfoPage>
  );
}
