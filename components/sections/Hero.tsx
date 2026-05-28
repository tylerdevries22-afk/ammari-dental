"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/MagneticButton";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ServicePills } from "@/components/ui/ServicePills";
import { site } from "@/lib/site";

const headlineWords = ["Friendly", "Staff.", "Beautiful", "Smiles.", "Welcoming", "Environment."];

export function Hero() {
  return (
    <section id="welcome" data-chapter="Welcome" className="relative pt-[72px] overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-(--color-brand-200) via-(--color-brand-100) to-transparent blur-3xl opacity-60 -z-10"
      />
      <div
        aria-hidden
        className="absolute top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-(--color-accent)/20 via-(--color-brand-50) to-transparent blur-3xl opacity-60 -z-10"
      />

      <Container className="relative pt-10 pb-10 lg:pt-16 lg:pb-14 grid grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left arch portrait — drifts down */}
        <div className="col-span-1 lg:col-span-3 order-2 lg:order-1">
          <ParallaxImage
            src="/images/generated/whitening-smile-hero.webp"
            alt="A patient with a bright, healthy smile at Ammari Dental"
            shape="arch"
            aspect="5 / 7"
            direction="normal"
            speed={0.13}
            sizes="(max-width: 1024px) 45vw, 22vw"
            className="bg-(--color-brand-100)"
          />
        </div>

        {/* Center copy */}
        <div className="col-span-2 lg:col-span-6 order-1 lg:order-2 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow inline-flex items-center justify-center gap-2"
          >
            <span className="w-8 h-px bg-(--color-brand-600)" />
            Aurora, Colorado · Since 2003
            <span className="w-8 h-px bg-(--color-brand-600)" />
          </m.div>

          <h1 className="mt-5 text-[clamp(34px,4.6vw,60px)] leading-[1.02] font-display tracking-[-0.03em]">
            <m.span
              className="inline-flex flex-wrap justify-center"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
              }}
            >
              {headlineWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                  <m.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "115%" },
                      show: { y: "0%", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    {word === "Smiles." ? (
                      <span className="relative inline-block">
                        <span className="relative z-10">{word}</span>
                        <m.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-0 right-0 bottom-1 h-[14%] bg-(--color-brand-200)/70 origin-left -z-0"
                        />
                      </span>
                    ) : (
                      word
                    )}
                    {i < headlineWords.length - 1 && " "}
                  </m.span>
                </span>
              ))}
            </m.span>
          </h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-lg lg:text-xl text-(--color-ink-700) max-w-xl mx-auto leading-relaxed"
          >
            Comprehensive family, cosmetic, and emergency dentistry led by Dr. Raed
            Ammari — with no judgment, ever. Same-day visits, most insurance accepted.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <Magnetic strength={0.4}>
              <Button href="/appointment" size="lg" iconEnd={<Icon name="arrow" className="w-4 h-4" />}>
                Book Appointment
              </Button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg" iconStart={<Icon name="phone" className="w-4 h-4" />}>
                {site.phone}
              </Button>
            </Magnetic>
          </m.div>
        </div>

        {/* Right arch portrait — drifts up (LCP) */}
        <div className="col-span-1 lg:col-span-3 order-3">
          <ParallaxImage
            src="/images/generated/implant-smile-hero.webp"
            alt="A happy patient smiling after treatment at Ammari Dental"
            shape="arch"
            aspect="5 / 7"
            direction="reverse"
            speed={0.18}
            priority
            sizes="(max-width: 1024px) 45vw, 22vw"
            className="bg-(--color-accent-100)"
          />
        </div>
      </Container>

      <Container className="pb-6">
        <m.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-2xl lg:text-3xl text-(--color-brand-700)"
        >
          A full range of care for every smile
        </m.p>
      </Container>
      <div className="pb-16 lg:pb-20">
        <ServicePills />
      </div>
    </section>
  );
}
