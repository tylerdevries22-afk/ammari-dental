"use client";
import Image from "next/image";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SmoothMarquee } from "@/components/ui/SmoothMarquee";
import { fadeUp, reveal } from "@/lib/motion";

const smiles = [
  { src: "/images/generated/people/man-30s.webp", alt: "A smiling Ammari Dental patient" },
  { src: "/images/generated/people/woman-hijab.webp", alt: "A smiling patient in a hijab" },
  { src: "/images/generated/people/senior-man.webp", alt: "A smiling older patient with glasses" },
  { src: "/images/generated/people/teen-braces.webp", alt: "A cheerful teenage patient with braces" },
  { src: "/images/generated/people/woman-50s.webp", alt: "A warmly smiling patient" },
  { src: "/images/generated/people/woman-wheelchair.webp", alt: "A beaming patient who uses a wheelchair" },
  { src: "/images/generated/people/man-40s.webp", alt: "A friendly smiling patient" },
  { src: "/images/generated/people/senior-woman.webp", alt: "A joyful older patient" },
  { src: "/images/generated/people/woman-40s.webp", alt: "A confident smiling patient" },
  { src: "/images/generated/people/woman-20s.webp", alt: "A patient with a bright, happy smile" },
];

export function SmilesStrip() {
  return (
    <section className="py-16 lg:py-24 overflow-hidden">
      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="eyebrow">Real smiles, real neighbors</div>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl">
            Aurora has been smiling with us <span className="text-aurora">since 2003</span>
          </h2>
        </m.div>
      </Container>

      <SmoothMarquee durationSec={80}>
        {smiles.map((s) => (
          <div
            key={s.src}
            className="relative w-[150px] sm:w-[170px] aspect-[3/4] rounded-(--radius-2xl) overflow-hidden shadow-(--shadow-soft-md) bg-(--color-surface-muted)"
          >
            <Image src={s.src} alt={s.alt} fill sizes="170px" loading="lazy" className="object-cover" />
          </div>
        ))}
      </SmoothMarquee>
    </section>
  );
}
