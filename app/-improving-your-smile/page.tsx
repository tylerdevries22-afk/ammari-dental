import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/-improving-your-smile");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Cosmetic care"
      title="Improving Your Smile"
      description="Modern cosmetic dentistry tailored to your face, your goals, and your budget — starting with a free consultation."
      url="/-improving-your-smile"
    >
      <p>
        Your smile is one of the first things people notice. If yours
        doesn&rsquo;t feel like you, there&rsquo;s almost always a way to
        change that — sometimes with a single visit, sometimes with a
        carefully staged plan. We start every cosmetic case the same way:
        listen first, examine carefully, then walk through the simplest
        path to the result you actually want.
      </p>

      <h2>Free Smile Consultation</h2>
      <p>
        We offer a complimentary cosmetic consultation for new and existing
        patients. We&rsquo;ll talk through what bothers you, look at your
        teeth, gums, and bite, and lay out the realistic options — no
        pressure, no surprise fees.
      </p>

      <h2>Cosmetic Options We Offer</h2>

      <h3>Professional Teeth Whitening</h3>
      <p>
        In-office and custom take-home options that lift years of staining
        from coffee, tea, and aging. Faster and far more even than
        over-the-counter strips. Learn more on our{" "}
        <a href="/teeth-whitening">whitening page</a>.
      </p>

      <h3>Cosmetic Bonding</h3>
      <p>
        Tooth-colored composite shaped and polished in a single visit to
        repair small chips, close minor gaps, and reshape uneven edges.
        Often the most affordable cosmetic option. See{" "}
        <a href="/bonding">bonding</a>.
      </p>

      <h3>Porcelain Veneers</h3>
      <p>
        Thin, custom shells of porcelain bonded to the front of your teeth
        to correct color, shape, length, and minor alignment issues at the
        same time. Read about{" "}
        <a href="/veneers">porcelain veneers</a>.
      </p>

      <h3>Tooth-Colored Fillings</h3>
      <p>
        Composite fillings that blend invisibly with your enamel and bond
        directly to the tooth — a great way to replace old silver fillings.
        See <a href="/tooth-colored-fillings">white fillings</a>.
      </p>

      <h3>Custom Crowns</h3>
      <p>
        When a tooth needs more than a filling, a porcelain or zirconia
        crown rebuilds strength and looks the way a natural tooth should.
        Details on our <a href="/dental-crowns">crowns page</a>.
      </p>

      <h3>Bridges</h3>
      <p>
        A fixed solution for one or more missing teeth — color-matched and
        contoured to your bite. See <a href="/bridges">bridges</a>.
      </p>

      <h3>Dental Implants</h3>
      <p>
        The closest thing to a natural tooth. We replace single teeth, full
        arches, and everything in between. Learn more about{" "}
        <a href="/dental-implants">implants</a>.
      </p>

      <h3>Smile Makeovers</h3>
      <p>
        Most great smiles are a combination of two or three of the
        treatments above, sequenced to keep cost down and results natural.
        We&rsquo;ll plan it together at your consultation.
      </p>
    </InfoPage>
  );
}
