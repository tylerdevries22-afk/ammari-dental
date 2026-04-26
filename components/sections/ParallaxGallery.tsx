"use client";
import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useSpring } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, reveal } from "@/lib/motion";

const tiles = [
  { src: "/images/practice/hero-1.webp", alt: "Treatment room", size: "tall", rate: 0.18 },
  { src: "/images/practice/hero-2.webp", alt: "Modern operatory", size: "wide", rate: -0.12 },
  { src: "/images/practice/hero-3.webp", alt: "Reception area", size: "square", rate: 0.24 },
  { src: "/images/practice/hero-4.webp", alt: "Comfortable lobby", size: "tall", rate: -0.20 },
];

export function ParallaxGallery() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="relative py-24 lg:py-36 overflow-hidden">
      <div aria-hidden className="absolute inset-0 aurora-gradient opacity-50 -z-10" />
      <Container>
        <SectionHeader
          eyebrow="Inside the office"
          title={
            <>
              Designed to feel <span className="text-aurora">at ease</span>.
            </>
          }
          description="Calm rooms, gentle lighting, and modern equipment — every detail tuned so your appointment feels less clinical and more comforting."
        />

        <div className="mt-20 grid grid-cols-12 gap-4 lg:gap-6 [grid-auto-rows:120px] lg:[grid-auto-rows:160px]">
          {tiles.map((t, i) => (
            <ParallaxTile
              key={t.src}
              src={t.src}
              alt={t.alt}
              size={t.size as "tall" | "wide" | "square"}
              rate={t.rate}
              progress={scrollYProgress}
              index={i}
            />
          ))}
        </div>

        <m.p
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="mt-16 max-w-2xl mx-auto text-center text-[--color-ink-700] text-lg leading-relaxed"
        >
          From a child&rsquo;s first cleaning to a full-mouth restoration,
          you&rsquo;ll find the same calm space, the same friendly faces, and the
          same uncompromising care.
        </m.p>
      </Container>
    </section>
  );
}

type Size = "tall" | "wide" | "square";

const sizeClass: Record<Size, string> = {
  tall: "col-span-6 lg:col-span-4 row-span-3",
  wide: "col-span-6 lg:col-span-8 row-span-2",
  square: "col-span-6 lg:col-span-4 row-span-2",
};

function ParallaxTile({
  src,
  alt,
  size,
  rate,
  progress,
  index,
}: {
  src: string;
  alt: string;
  size: Size;
  rate: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
}) {
  const yRaw = useTransform(progress, [0, 1], [0, rate * 320]);
  const y = useSpring(yRaw, { stiffness: 60, damping: 22 });
  const scaleRaw = useTransform(progress, [0, 0.5, 1], [1.06, 1, 1.04]);
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 24 });

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${sizeClass[size]} relative rounded-[28px] overflow-hidden shadow-[--shadow-soft-md] bg-[--color-brand-50]`}
    >
      <m.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </m.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[--color-brand-900]/30 via-transparent to-transparent pointer-events-none" />
    </m.div>
  );
}
