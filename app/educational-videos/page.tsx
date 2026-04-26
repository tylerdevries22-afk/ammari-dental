import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/educational-videos");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Learn more"
      title="Educational Videos"
      description="Short videos explaining common procedures and oral health topics."
      url="/educational-videos"
    >
      <p>
        Our patient education library contains videos on common dental
        procedures and oral health topics. Browse the topics below or visit our{" "}
        <a href="/-q---a">Q &amp; A</a> page for written answers.
      </p>
    </InfoPage>
  );
}
