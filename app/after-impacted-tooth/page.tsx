import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/after-impacted-tooth");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Recovery"
      title="After Impacted Tooth Removal"
      description="Care after removal of an impacted tooth."
      url="/after-impacted-tooth"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <h2>Bleeding</h2>
      <p>Bite firmly on gauze for 30–45 minutes. Replace as needed.</p>
      <h2>Swelling</h2>
      <p>Apply ice in 20-minute intervals for the first 24 hours.</p>
      <h2>Eating</h2>
      <p>Soft foods only for the first 24–48 hours. Avoid hot liquids.</p>
    ` }} />
    </InfoPage>
  );
}
