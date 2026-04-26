import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/post-op-instructions");

export default function Page() {
  return (
    <InfoPage
      eyebrow="After your visit"
      title="Post-Op Instructions"
      description="General post-operative care instructions for our patients."
      url="/post-op-instructions"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <p>Following your treatment, please follow these general guidelines for the best recovery.</p>
      <ul>
        <li>Take medications as prescribed.</li>
        <li>Avoid hot, hard, or crunchy foods for the first 24 hours.</li>
        <li>Maintain gentle oral hygiene.</li>
        <li>Call us with any questions or concerns.</li>
      </ul>
      <p>For specific procedures see:
        <a href="/after-dental-implant-surgery">After Implants</a>,{' '}
        <a href="/after-wisdom-tooth-removal">After Wisdom Teeth</a>,{' '}
        <a href="/after-impacted-tooth">After Impacted Tooth</a>.
      </p>
    ` }} />
    </InfoPage>
  );
}
