"use client";
import { useRef } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

export function CTABanner({
  title = "Ready when you are.",
  description = "Book your visit online or call us today.",
}: { title?: string; description?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 100, damping: 22 });
  const sy = useSpring(my, { stiffness: 100, damping: 22 });
  const blobX = useTransform(sx, [0, 1], ["-10%", "60%"]);
  const blobY = useTransform(sy, [0, 1], ["-10%", "70%"]);
  const blobX2 = useTransform(sx, [0, 1], ["80%", "10%"]);
  const blobY2 = useTransform(sy, [0, 1], ["90%", "10%"]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section className="py-24 bg-(--color-surface-warm)">
      <Container>
        <m.div
          ref={ref}
          onMouseMove={onMove}
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="rounded-[28px] bg-(--color-ink-900) text-white p-10 lg:p-20 text-center relative overflow-hidden isolate"
        >
          <m.div
            style={{ left: blobX, top: blobY }}
            className="pointer-events-none absolute w-[520px] h-[520px] rounded-full bg-(--color-brand-600)/40 blur-3xl -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          />
          <m.div
            style={{ left: blobX2, top: blobY2 }}
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-(--color-accent)/25 blur-3xl -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          />
          <m.div
            style={{ y: parallaxY }}
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
            aria-hidden
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 800 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="dots"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
              </defs>
              <rect width="800" height="400" fill="url(#dots)" />
            </svg>
          </m.div>

          <div className="relative">
            <SplitText
              as="h2"
              text={title}
              className="block text-4xl lg:text-6xl font-display tracking-tight text-(--color-accent-300)!"
            />
            <m.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-5 text-white/75 max-w-xl mx-auto text-lg"
            >
              {description}
            </m.p>
            <m.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <Magnetic strength={0.4}>
                <Button
                  href="/appointment"
                  size="lg"
                  className="bg-(--color-accent)! text-(--color-brand-900)! hover:bg-(--color-accent-300)!"
                >
                  Book Appointment
                </Button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Button
                  href={`tel:${site.phoneTel}`}
                  variant="ghost"
                  size="lg"
                  className="text-(--color-accent-300)! border! border-(--color-accent)/50! hover:bg-(--color-accent)/10!"
                >
                  Call {site.phone}
                </Button>
              </Magnetic>
            </m.div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
