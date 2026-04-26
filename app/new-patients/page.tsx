import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/new-patients");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Welcome"
      title="New Patients"
      description="What to expect at your first visit, the forms to bring, and how to make the most of your time in the chair."
      url="/new-patients"
    >
      <h2>Our Mission</h2>
      <p>
        Our mission is simple: deliver exceptional, gentle dentistry in an
        environment that genuinely puts you at ease. We listen first, treat
        carefully, and explain every option so you can make confident
        decisions about your care.
      </p>

      <h2>What to Expect</h2>
      <p>
        Your first appointment is about getting to know each other. After a
        warm welcome at the front desk, we&rsquo;ll review your medical and
        dental history together. Your visit typically includes:
      </p>
      <ul>
        <li>A comprehensive oral exam, including oral-cancer screening</li>
        <li>Digital X-rays as needed (very low radiation, instant images)</li>
        <li>A periodontal (gum health) evaluation</li>
        <li>A professional cleaning, when appropriate at the first visit</li>
        <li>A review of any findings, plus a personalized treatment plan</li>
        <li>Honest, written estimates before any work begins</li>
      </ul>

      <h2>Patient Forms</h2>
      <p>
        Save time at your appointment by completing your forms ahead of
        time on our <a href="/-new-patient-forms">New Patient Forms</a>
        {" "}page. Forms include:
      </p>
      <ul>
        <li>Welcome / Patient Information</li>
        <li>Health History</li>
        <li>HIPAA Notice of Privacy Practices</li>
        <li>Dental Office Policies</li>
      </ul>
      <p>
        Bring a photo ID and your insurance card to your first visit. If
        you can&rsquo;t fill the forms out in advance, please arrive
        about 15 minutes early.
      </p>

      <h2>Insurance &amp; Financing</h2>
      <p>
        We accept most major dental insurance and offer flexible financing
        through CareCredit. See our <a href="/financing">Financing</a> page
        for current no-interest and low-interest plans, or call us at{" "}
        <a href="tel:+13032838009">(303) 283-8009</a> to verify your
        benefits.
      </p>

      <h2>Have Questions?</h2>
      <p>
        Take a look at our <a href="/-q---a">Q &amp; A page</a> for the
        questions we hear most often, or just give us a call — we&rsquo;re
        happy to help.
      </p>
    </InfoPage>
  );
}
