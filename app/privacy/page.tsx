import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/privacy");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we protect your information."
      url="/privacy"
    >
      <p>
        Ammari Dental respects your privacy. We collect only information
        necessary to provide your care and operate this website, and we never
        sell your personal data.
      </p>
      <h2>Health Information (HIPAA)</h2>
      <p>
        Protected health information is handled according to HIPAA regulations.
        Forms on this website are for appointment requests only and should not
        be used to share sensitive health data.
      </p>
      <h2>Cookies &amp; Analytics</h2>
      <p>
        We use anonymous analytics cookies to understand how visitors use our
        site. You can disable cookies in your browser settings.
      </p>
    </InfoPage>
  );
}
