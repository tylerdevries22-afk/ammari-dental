import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/financing");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Payment options"
      title="Financing"
      description="Flexible ways to pay so great dentistry fits your budget."
      url="/financing"
    >
      <p>
        We never want cost to be the reason you put off treatment. Our team
        will give you a clear, written estimate up front, run your insurance
        for maximum benefit, and walk through the financing plan that makes
        the most sense for your situation.
      </p>

      <h2>Insurance</h2>
      <p>
        We accept most major dental insurance plans and are in network with
        many of them. We&rsquo;ll verify your benefits before treatment and
        bill your insurance directly so you only pay your portion at the
        time of service.
      </p>

      <h2>CareCredit</h2>
      <p>
        CareCredit is a healthcare credit card designed specifically for
        elective and out-of-pocket procedures. We&rsquo;re proud to offer it
        because it lets patients move forward with treatment now and pay
        over time.
      </p>

      <h3>No-Interest Plans</h3>
      <ul>
        <li>3, 6, 12, or 18 months at 0% interest, when the monthly minimum is paid on time and the balance is paid in full by the end of the promotional period.</li>
      </ul>

      <h3>Extended Plans</h3>
      <ul>
        <li>24, 36, 48, or 60-month options with reduced APR (currently 13.9%) — useful for larger cases like full-arch implants or full-mouth reconstruction.</li>
      </ul>
      <p>
        Apply online before your visit or right at the front desk. Approval
        is usually instant. Final terms are set by CareCredit at the time
        of application.
      </p>

      <h2>Cash, Check &amp; Cards</h2>
      <p>
        We accept cash, personal checks, and all major credit cards. A
        courtesy discount may be available when treatment is paid in full
        at the time of service.
      </p>

      <h2>Questions About Cost?</h2>
      <p>
        Call us at <a href="tel:+13032838009">(303) 283-8009</a>. We&rsquo;re
        happy to talk through your options before you ever come in.
      </p>
    </InfoPage>
  );
}
