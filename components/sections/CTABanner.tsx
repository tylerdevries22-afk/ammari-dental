"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

export function CTABanner({
  title = "Ready when you are.",
  description = "Book your visit online or call us today.",
}: { title?: string; description?: string }) {
  return (
    <section className="py-24">
      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="rounded-[28px] bg-[--color-ink-900] text-white p-10 lg:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[--color-brand-600]/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[--color-accent]/15 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-display tracking-tight">{title}</h2>
            <p className="mt-4 text-white/75 max-w-xl mx-auto">{description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/appointment" size="lg" className="!bg-white !text-[--color-ink-900]">
                Book Appointment
              </Button>
              <Button
                href={`tel:${site.phoneTel}`}
                variant="ghost"
                size="lg"
                className="!text-white !border !border-white/30 hover:!bg-white/10"
              >
                Call {site.phone}
              </Button>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
