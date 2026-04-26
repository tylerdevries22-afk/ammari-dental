import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Icon } from "@/components/ui/Icon";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/gallery");

const items = Array.from({ length: 9 }, (_, i) => i);

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Inside the practice"
        title="Photo Gallery"
        description="Take a look around our office and see the smiles we've helped create."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="pb-24">
        <Container>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((i) => (
              <li
                key={i}
                className="aspect-square rounded-2xl bg-gradient-to-br from-[--color-brand-100] to-[--color-brand-50] grid place-items-center text-[--color-brand-700]"
              >
                <Icon name="smile" className="w-12 h-12 opacity-50" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CTABanner />
    </>
  );
}
