"use client";
import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SmoothMarquee } from "@/components/ui/SmoothMarquee";
import { useMotion } from "@/lib/useMotion";
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
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Gentle counter-scroll drift on the portrait row for depth.
  const rowY = useTransform(scrollYProgress, [0, 1], [34, -34]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Soft brand glow behind the row — the only brand fill in this band. */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[55%] rounded-[50%] bg-(--color-brand-200)/30 blur-3xl" />

      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="relative text-center mb-12 lg:mb-16"
        >
          <div className="eyebrow">Real smiles, real neighbors</div>
          <h2 className="mt-2 font-display text-3xl lg:text-4xl">
            Aurora has been smiling with us <span className="text-aurora">since 2003</span>
          </h2>
        </m.div>
      </Container>

      <m.div style={{ y: enabled ? rowY : 0 }} className="relative">
        {/* Horizontal edge fades dissolve the row into the band. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-(--color-bg) to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-(--color-bg) to-transparent" />

        <SmoothMarquee durationSec={80}>
          {smiles.map((s) => (
            <figure
              key={s.src}
              className="group relative w-[150px] sm:w-[172px] aspect-[3/4] rounded-(--radius-2xl) overflow-hidden shadow-(--shadow-soft-md) ring-1 ring-(--color-surface)/60 bg-(--color-surface-muted) transition-[transform,box-shadow] duration-500 ease-(--ease-out) hover:-translate-y-1.5 hover:shadow-(--shadow-soft-lg)"
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="172px"
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.06]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-(--color-brand-900)/15 via-transparent to-transparent" />
            </figure>
          ))}
        </SmoothMarquee>
      </m.div>
    </section>
  );
}
