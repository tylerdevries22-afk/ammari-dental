import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/surgical-instructions");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Procedure prep"
      title="Surgical Instructions"
      description="What to expect before and after dental surgery."
      url="/surgical-instructions"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <h2>Before Surgery</h2>
      <ul>
        <li>Get a good night's rest.</li>
        <li>Eat a light meal unless instructed otherwise.</li>
        <li>Take any pre-medications as prescribed.</li>
      </ul>
      <h2>After Surgery</h2>
      <ul>
        <li>Bite gently on gauze for 30–45 minutes.</li>
        <li>Apply ice to reduce swelling.</li>
        <li>Stick to soft foods for 24 hours.</li>
        <li>Avoid using a straw or smoking.</li>
      </ul>
    ` }} />
    </InfoPage>
  );
}
