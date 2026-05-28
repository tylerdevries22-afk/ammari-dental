import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { BreadcrumbSchema } from "@/components/schema/Schema";
import { metaFor } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = metaFor("/-new-patient-forms");

type Form = {
  title: string;
  description: string;
  file: string;
  filename: string;
  sizeKB: number;
};

const forms: Form[] = [
  {
    title: "Welcome / Patient Information",
    description:
      "Basic contact info, emergency contact, and dental insurance details. Bring this so we can verify your benefits before the appointment.",
    file: "/forms/welcome.pdf",
    filename: "ammari-dental-welcome.pdf",
    sizeKB: 68,
  },
  {
    title: "Health History",
    description:
      "A full medical and dental history — current medications, allergies, prior procedures. Helps Dr. Ammari plan safe, appropriate treatment.",
    file: "/forms/health-history.pdf",
    filename: "ammari-dental-health-history.pdf",
    sizeKB: 2669,
  },
  {
    title: "HIPAA Notice of Privacy Practices",
    description:
      "Our written notice describing how we protect your personal health information and your rights as a patient. Acknowledgement signed at your first visit.",
    file: "/forms/hipaa-notice.pdf",
    filename: "ammari-dental-hipaa-notice.pdf",
    sizeKB: 77,
  },
  {
    title: "Office Policies",
    description:
      "Appointment, cancellation, and payment policies — please review and sign before your first visit.",
    file: "/forms/office-policies.pdf",
    filename: "ammari-dental-office-policies.pdf",
    sizeKB: 60,
  },
];

function FormCard({ form }: { form: Form }) {
  return (
    <li className="group relative flex flex-col h-full rounded-2xl bg-white border border-(--color-brand-100) p-6 shadow-(--shadow-soft-sm) hover:shadow-(--shadow-soft-md) transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="grid place-items-center shrink-0 w-12 h-12 rounded-lg bg-(--color-brand-50) text-(--color-brand-700)">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h4" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-(--color-ink-900)">
            {form.title}
          </h3>
          <div className="mt-1 data-mono text-[11px] uppercase tracking-widest text-(--color-ink-500)">
            PDF · {form.sizeKB < 1024 ? `${form.sizeKB} KB` : `${(form.sizeKB / 1024).toFixed(1)} MB`}
          </div>
        </div>
      </div>
      <p className="text-(--color-ink-700) leading-relaxed text-sm mb-6 grow">
        {form.description}
      </p>
      <a
        href={form.file}
        download={form.filename}
        className="inline-flex items-center justify-center gap-2 mt-auto rounded-full bg-(--color-brand-700) hover:bg-(--color-brand-800) text-(--color-brand-50) px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-500)"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        Download PDF
      </a>
    </li>
  );
}

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Paperwork"
        title="New Patient Forms"
        description="Download, print, and complete these forms before your first appointment to save time at check-in."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Patient Resources" },
          { label: "New Patient Forms" },
        ]}
      />
      <section className="pb-12 lg:pb-16">
        <Container className="max-w-5xl">
          <ul className="grid sm:grid-cols-2 gap-5">
            {forms.map((f) => (
              <FormCard key={f.file} form={f} />
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-24">
        <Container className="max-w-3xl">
          <div className="rounded-2xl bg-(--color-surface-warm) border border-(--color-brand-100) p-6 lg:p-8">
            <div className="eyebrow text-(--color-brand-700) mb-3">What to do next</div>
            <ol className="space-y-3 text-(--color-ink-700) leading-relaxed list-decimal pl-5">
              <li>Download each form above and print it at home.</li>
              <li>
                Fill them out completely. Take your time with the Health History
                &mdash; accurate info helps us plan safe treatment.
              </li>
              <li>
                Bring the completed forms, a photo ID, and your dental
                insurance card to your first visit.
              </li>
              <li>
                Can&rsquo;t print? No problem &mdash; arrive about 15 minutes
                early and we&rsquo;ll have paper copies ready for you in the
                office.
              </li>
            </ol>
            <p className="mt-6 text-sm text-(--color-ink-500)">
              Questions about the forms? Call us at{" "}
              <a
                href={`tel:${site.phoneTel}`}
                className="text-(--color-brand-700) underline font-semibold"
              >
                {site.phone}
              </a>
              {site.email ? (
                <>
                  {" "}or email{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-(--color-brand-700) underline font-semibold"
                  >
                    {site.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          </div>
        </Container>
      </section>

      <CTABanner />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "New Patient Forms", url: "/-new-patient-forms" },
        ]}
      />
    </>
  );
}
