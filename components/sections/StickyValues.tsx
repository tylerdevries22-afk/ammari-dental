"use client";
import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const values = [
  {
    icon: "smile",
    eyebrow: "01 — Listening first",
    title: "We start with your story.",
    body:
      "Every smile is different. Before we recommend anything, we listen to what's bothering you and what you'd love to change. The plan is built around you, not a script.",
  },
  {
    icon: "shield",
    eyebrow: "02 — Conservative care",
    title: "Less drilling. More dentistry.",
    body:
      "Modern materials and bonding techniques let us preserve more of your natural tooth structure. The most beautiful work is the work you don't notice.",
  },
  {
    icon: "heart",
    eyebrow: "03 — Comfort, always",
    title: "Made for sensitive patients.",
    body:
      "Warm blankets, calming music, gentle anesthesia, and a team that truly takes its time. If you've been putting it off, we'll meet you where you are.",
  },
  {
    icon: "tooth",
    eyebrow: "04 — Honest pricing",
    title: "No surprises at checkout.",
    body:
      "Written estimates, insurance verified up front, and CareCredit options when you need them. You'll know the number before you sit in the chair.",
  },
];

export function StickyValues() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.5]);
  const blobX = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={ref}
      className="relative bg-[--color-brand-900] text-white"
      style={{ height: `${values.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <m.div
            style={{ y: bgY, opacity: bgOpacity }}
            className="absolute -top-1/4 -left-1/4 w-[120%] h-[140%] aurora-gradient"
          />
          <m.div
            style={{ x: blobX }}
            className="absolute top-1/4 right-0 w-[460px] h-[460px] rounded-full bg-[--color-accent]/10 blur-3xl"
          />
        </div>

        <Container className="relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <m.div style={{ opacity: headingOpacity }}>
              <div className="eyebrow !text-[--color-brand-200]">How we work</div>
              <h2 className="mt-3 text-4xl lg:text-6xl font-display tracking-tight leading-[1.05]">
                Four ideas behind every visit.
              </h2>
              <p className="mt-6 text-white/70 max-w-md leading-relaxed">
                Two decades of practice in Aurora has taught us that great
                dentistry is mostly about the details — and how you make
                people feel along the way.
              </p>
              <ScrollPips count={values.length} progress={scrollYProgress} />
            </m.div>
          </div>

          <div className="lg:col-span-7 relative h-[420px] lg:h-[500px]">
            {values.map((v, i) => (
              <ValueCard
                key={v.title}
                index={i}
                total={values.length}
                progress={scrollYProgress}
                {...v}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function ValueCard({
  index,
  total,
  progress,
  icon,
  eyebrow,
  title,
  body,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  icon: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const cushion = segment * 0.25;

  const a = Math.max(0, start - cushion);
  const b = start + cushion;
  const c = end - cushion;
  const d = Math.min(1, end + cushion);

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [40, 0, 0, -40]);
  const scale = useTransform(progress, [a, b, c, d], [0.96, 1, 1, 0.96]);

  return (
    <m.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 grid place-items-center"
    >
      <div className="w-full max-w-xl rounded-[28px] glass !bg-white/8 !border-white/15 p-10 lg:p-12 backdrop-blur-xl">
        <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[--color-brand-600]/40 text-[--color-brand-100]">
          <Icon name={icon} className="w-6 h-6" />
        </span>
        <div className="mt-6 text-xs font-semibold tracking-[0.18em] uppercase text-[--color-brand-200]">
          {eyebrow}
        </div>
        <h3 className="mt-3 text-3xl lg:text-4xl font-display tracking-tight leading-tight">
          {title}
        </h3>
        <p className="mt-4 text-white/75 leading-relaxed">{body}</p>
      </div>
    </m.div>
  );
}

function ScrollPips({
  count,
  progress,
}: {
  count: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  return (
    <div className="mt-10 flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <ScrollPip key={i} index={i} count={count} progress={progress} />
      ))}
    </div>
  );
}

function ScrollPip({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const segment = 1 / count;
  const start = index * segment;
  const end = (index + 1) * segment;
  const a = Math.max(0, start - 0.05);
  const b = start;
  const c = end;
  const d = Math.min(1, end + 0.05);

  const opacity = useTransform(progress, [a, b, c, d], [0.25, 1, 1, 0.25]);
  const width = useTransform(progress, [a, b, c, d], [12, 36, 36, 12]);
  return (
    <m.div
      style={{ opacity, width }}
      className="h-[2px] bg-[--color-brand-200] rounded-full"
    />
  );
}
