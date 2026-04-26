import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/new-patients");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Welcome"
      title="New Patients"
      description="Everything you need to know before your first visit at Ammari Dental."
      url="/new-patients"
    >
      <h2>What to Expect</h2>
      <p>
        Your first visit usually includes a full examination, digital X-rays,
        and a thorough cleaning. We&rsquo;ll get to know your goals and put
        together a personalized care plan.
      </p>
      <h2>Forms</h2>
      <p>
        Save time at your appointment by completing your{" "}
        <a href="/-new-patient-forms">new patient forms</a> in advance.
      </p>
      <h2>Insurance &amp; Financing</h2>
      <p>
        We accept most major dental insurance and offer flexible financing
        through CareCredit. Visit our <a href="/financing">Financing</a> page
        for details.
      </p>
    </InfoPage>
  );
}
