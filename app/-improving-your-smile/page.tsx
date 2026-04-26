import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/-improving-your-smile");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Cosmetic care"
      title="Improving Your Smile"
      description="Cosmetic options to help you love what you see in the mirror."
      url="/-improving-your-smile"
    >
      <p>
        From subtle whitening to full smile makeovers with veneers and
        bonding, we offer a full range of cosmetic dentistry services
        tailored to your goals.
      </p>
      <h2>Popular Options</h2>
      <ul>
        <li><a href="/teeth-whitening">Professional teeth whitening</a></li>
        <li><a href="/veneers">Porcelain veneers</a></li>
        <li><a href="/bonding">Cosmetic bonding</a></li>
        <li><a href="/dental-crowns">Custom crowns</a></li>
      </ul>
    </InfoPage>
  );
}
