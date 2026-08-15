import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { isBookingApiEnabled } from "@/lib/booking/flag";
import { verifyCancelToken } from "@/lib/booking/cancelToken";
import { ManagePanel } from "@/components/booking/ManagePanel";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Manage appointment | ${site.name}`,
  robots: { index: false, follow: false },
};

export default async function ManagePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!isBookingApiEnabled()) notFound();
  const { token } = await params;
  const claim = verifyCancelToken(token);
  const valid = !!claim;

  return (
    <>
      <PageHero
        eyebrow="Appointment"
        title={valid ? "Manage your appointment" : "Link expired"}
        description={
          valid
            ? "Cancel the visit, or call us to reschedule — we'll find a better fit."
            : "This link is no longer valid. Call our office and we'll help right away."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Appointment", href: "/appointment" },
          { label: "Manage" },
        ]}
      />
      <section className="pb-24">
        <Container className="max-w-2xl">
          <ManagePanel token={token} valid={valid} />
        </Container>
      </section>
    </>
  );
}
