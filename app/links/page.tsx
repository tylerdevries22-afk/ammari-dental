import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/links");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Resources"
      title="Helpful Links"
      description="Trusted oral-health resources and quick links to the topics our patients ask about most."
      url="/links"
    >
      <h2>Dental Associations</h2>
      <ul>
        <li><a href="https://www.ada.org" rel="noopener" target="_blank">American Dental Association (ADA)</a></li>
        <li><a href="https://www.cdaonline.org" rel="noopener" target="_blank">Colorado Dental Association</a></li>
        <li><a href="https://www.aae.org" rel="noopener" target="_blank">American Association of Endodontists</a></li>
        <li><a href="https://www.aaid.com" rel="noopener" target="_blank">American Academy of Implant Dentistry</a></li>
        <li><a href="https://www.aacd.com" rel="noopener" target="_blank">American Academy of Cosmetic Dentistry</a></li>
        <li><a href="https://www.perio.org" rel="noopener" target="_blank">American Academy of Periodontology</a></li>
        <li><a href="https://www.mouthhealthy.org" rel="noopener" target="_blank">Mouth Healthy by the ADA</a></li>
        <li><a href="https://www.cdc.gov/oralhealth" rel="noopener" target="_blank">CDC Oral Health</a></li>
      </ul>

      <h2>Common Procedures &amp; Topics</h2>
      <ul>
        <li><a href="/dental-implants">Dental Implants</a></li>
        <li><a href="/teeth-whitening">Teeth Whitening</a></li>
        <li><a href="/veneers">Porcelain Veneers</a></li>
        <li><a href="/bonding">Cosmetic Bonding</a></li>
        <li><a href="/dental-crowns">Dental Crowns</a></li>
        <li><a href="/bridges">Bridges</a></li>
        <li><a href="/dentures">Dentures</a></li>
        <li><a href="/implant-dentures">Implant-Supported Dentures</a></li>
        <li><a href="/root-canal">Root Canal Therapy</a></li>
        <li><a href="/extractions">Extractions</a></li>
        <li><a href="/multiple-tooth-extractions">Multiple Tooth Extractions</a></li>
        <li><a href="/tooth-colored-fillings">Tooth-Colored Fillings</a></li>
        <li><a href="/deep-cleaning">Deep Cleanings</a></li>
        <li><a href="/preventative-periodontics">Preventative Periodontics</a></li>
        <li><a href="/dental-emergencies">Dental Emergencies</a></li>
        <li><a href="/night-guards">Night Guards</a></li>
        <li><a href="/comfortable-dentistry">Comfortable Dentistry</a></li>
        <li><a href="/-improving-your-smile">Improving Your Smile</a></li>
        <li><a href="/-q---a">Frequently Asked Questions</a></li>
        <li><a href="/-new-patient-forms">New Patient Forms</a></li>
        <li><a href="/financing">Financing &amp; CareCredit</a></li>
        <li><a href="/post-op-instructions">Post-Op Instructions</a></li>
        <li><a href="/surgical-instructions">Surgical Instructions</a></li>
        <li><a href="/before-anesthesia">Before Anesthesia</a></li>
        <li><Link href="/articles/general">Patient Education Library</Link></li>
      </ul>
    </InfoPage>
  );
}
