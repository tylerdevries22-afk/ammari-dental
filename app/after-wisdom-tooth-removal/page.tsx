import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/after-wisdom-tooth-removal");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Recovery"
      title="After Wisdom Tooth Removal"
      description="Care after wisdom tooth extraction."
      url="/after-wisdom-tooth-removal"
    >
      <div dangerouslySetInnerHTML={{ __html: `
      <h2>The First Day</h2>
      <ul>
        <li>Rest and keep your head elevated.</li>
        <li>Bite on gauze to control bleeding.</li>
        <li>Apply ice for 20 minutes on, 20 off.</li>
      </ul>
      <h2>Days 2–7</h2>
      <ul>
        <li>Begin gentle warm salt water rinses.</li>
        <li>Eat soft foods and drink plenty of water.</li>
        <li>Avoid straws, smoking, and strenuous activity.</li>
      </ul>
    ` }} />
    </InfoPage>
  );
}
