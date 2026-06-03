import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { metaFor } from "@/lib/metadata";

export const metadata: Metadata = metaFor("/gallery");

const galleryItems: { src: string; alt: string; caption: string }[] = [
  {
    src: "/images/generated/reception-interior.webp",
    alt: "Calm modern reception area at Ammari Dental with linen sofa, brass desk, and dried palm fronds",
    caption: "Reception",
  },
  {
    src: "/images/generated/operatory-endodontic.webp",
    alt: "Modern dental operatory with advanced equipment and a calm teal accent wall",
    caption: "Treatment Room",
  },
  {
    src: "/images/generated/patient-calm-chair.webp",
    alt: "Relaxed patient in a modern ergonomic dental chair, soft window light",
    caption: "Comfortable Care",
  },
  {
    src: "/images/generated/whitening-smile-hero.webp",
    alt: "Confident smile after professional teeth whitening at Ammari Dental",
    caption: "Whitening",
  },
  {
    src: "/images/generated/veneers-smile-hero.webp",
    alt: "Beautiful smile transformed with porcelain veneers",
    caption: "Veneers",
  },
  {
    src: "/images/generated/crowns-smile-hero.webp",
    alt: "Confident smile restored with natural-looking porcelain dental crowns",
    caption: "Crowns",
  },
  {
    src: "/images/generated/implant-macro-hero.webp",
    alt: "Premium restorative dentistry — dental implant and porcelain crown detail",
    caption: "Implants",
  },
  {
    src: "/images/generated/dentures-smile-hero.webp",
    alt: "Confident senior with a natural smile after custom dentures",
    caption: "Dentures",
  },
  {
    src: "/images/generated/bonding-after.webp",
    alt: "Front tooth seamlessly restored with cosmetic bonding",
    caption: "Bonding",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Inside the practice"
        title="Photo Gallery"
        description="Take a look around the office and at the smiles we&rsquo;ve helped restore — every detail tuned for a calm, premium experience."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="pb-24">
        <Container>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryItems.map((item) => (
              <li
                key={item.src}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-(--color-brand-50) shadow-(--shadow-soft-sm) hover:shadow-(--shadow-soft-md) transition-shadow"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-(--color-brand-900)/55 via-transparent to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block data-mono text-[10px] uppercase tracking-widest bg-(--surface-glass) text-(--color-brand-50) px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {item.caption}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CTABanner />
    </>
  );
}
