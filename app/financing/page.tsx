import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/financing");

export default function Page() {
  return (
    <InfoPage
      eyebrow="Payment options"
      title="Financing"
      description="Flexible payment options so that great dentistry fits your budget."
      url="/financing"
    >
      <h2>Insurance</h2>
      <p>
        We accept most major dental insurance plans. Our team will verify your
        benefits and maximize what your plan covers.
      </p>
      <h2>CareCredit</h2>
      <p>
        We offer CareCredit financing, which provides interest-free payment
        plans for qualifying patients. Apply at your visit or in advance.
      </p>
      <h2>Cash &amp; Card</h2>
      <p>
        We accept cash, check, and all major credit cards. Discounts may be
        available for treatment paid in full at the time of service.
      </p>
    </InfoPage>
  );
}
