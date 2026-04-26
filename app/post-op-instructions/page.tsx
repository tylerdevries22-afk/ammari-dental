import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/post-op-instructions");

export default function Page() {
  return (
    <InfoPage
      eyebrow="After your visit"
      title="Post-Op Instructions"
      description="Recovery guidance by procedure. Follow these steps carefully — and call us if anything doesn't feel right."
      url="/post-op-instructions"
    >
      <p>
        Most patients go back to normal activity within a day or two.
        Following the right after-care protocol speeds healing and keeps
        your new dental work looking and feeling great. If you have
        unexpected pain, swelling, or bleeding, call us at{" "}
        <a href="tel:+13032838009">(303) 283-8009</a>.
      </p>

      <h2>After a Root Canal</h2>
      <ul>
        <li>The numbness will wear off over a couple of hours — avoid chewing on that side until full sensation returns.</li>
        <li>Mild tenderness for a few days is normal. Ibuprofen handles it well for most patients.</li>
        <li>Brush and floss as usual, gently around the treated tooth.</li>
        <li>Schedule the permanent crown promptly — a temporary filling is not a long-term seal.</li>
      </ul>

      <h2>After a Crown or Bridge</h2>
      <ul>
        <li>Avoid sticky, hard, or chewy foods for the first 24 hours, especially with a temporary crown.</li>
        <li>Some sensitivity to hot or cold for a week or two is normal.</li>
        <li>Floss carefully around the new restoration — pull the floss out the side rather than snapping up.</li>
        <li>If a temporary comes off, save it and call us — don&rsquo;t leave the prep exposed.</li>
      </ul>

      <h2>After a White (Composite) Filling</h2>
      <ul>
        <li>You can eat as soon as the numbness wears off — composite is fully cured before you leave.</li>
        <li>Mild sensitivity to cold for a few days is normal.</li>
        <li>If your bite feels high or off after the anesthetic wears off, call us — a quick polish-down usually fixes it.</li>
      </ul>

      <h2>After Scaling &amp; Root Planing (Deep Cleaning)</h2>
      <ul>
        <li>Gums may feel tender for a day or two — warm salt-water rinses help.</li>
        <li>Some sensitivity to cold is common while the gum tissue heals.</li>
        <li>Avoid spicy or acidic foods for 24 hours.</li>
        <li>Resume gentle brushing and flossing the same day. Healing depends on it.</li>
      </ul>

      <h2>After Veneers</h2>
      <ul>
        <li>Avoid biting into hard foods (apples, hard bread, ice) for the first week.</li>
        <li>Some gum tenderness around the new edges is normal — it settles within a few days.</li>
        <li>If you grind your teeth at night, wear the night guard we recommended.</li>
        <li>Call us if a veneer feels rough, sharp, or loose at any time.</li>
      </ul>

      <h2>After an Extraction</h2>
      <ul>
        <li>Bite firmly on gauze for 30–45 minutes to form a clot. Replace the pad if bleeding continues.</li>
        <li>Do not rinse, spit, smoke, or use a straw for at least 24 hours — disturbing the clot can cause dry socket.</li>
        <li>Apply an ice pack on the cheek for the first few hours to control swelling.</li>
        <li>Stick to soft, lukewarm foods for the first day.</li>
        <li>Resume gentle brushing the next day, avoiding the extraction site.</li>
      </ul>

      <h2>Surgical Procedures</h2>
      <p>
        For procedure-specific surgical instructions see:{" "}
        <a href="/after-dental-implant-surgery">After Implant Surgery</a>,{" "}
        <a href="/after-wisdom-tooth-removal">After Wisdom Tooth Removal</a>,{" "}
        <a href="/after-impacted-tooth">After Impacted Tooth Removal</a>,{" "}
        <a href="/multiple-tooth-extractions">Multiple Tooth Extractions</a>, and{" "}
        <a href="/before-anesthesia">Before Anesthesia</a>.
      </p>
    </InfoPage>
  );
}
