import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/notice-of-non-discrimination");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Notice of Non-Discrimination"
      description="Ammari Dental's commitment to equal access to care."
      url="/notice-of-non-discrimination"
    >
      <p>
        Ammari Dental complies with applicable federal civil rights laws and
        does not discriminate on the basis of race, color, national origin,
        age, disability, sex, or religion.
      </p>
      <p>
        We provide free aids and services to people with disabilities and free
        language services to people whose primary language is not English.
      </p>
    </InfoPage>
  );
}
