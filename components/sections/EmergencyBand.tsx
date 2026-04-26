"use client";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";
import { fadeUp, reveal } from "@/lib/motion";

export function EmergencyBand() {
  return (
    <section className="py-20">
      <Container>
        <m.div
          variants={fadeUp}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[--color-brand-700] via-[--color-brand-600] to-[--color-brand-400] text-white p-10 lg:p-14"
        >
          <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/5"
          />
          <div className="relative grid lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-white/15">
                  <Icon name="alert" className="w-3 h-3" />
                </span>
                Dental Emergency
              </div>
              <h2 className="mt-4 text-4xl lg:text-5xl font-display tracking-tight leading-[1.05]">
                Pain, swelling, or a broken tooth?
              </h2>
              <p className="mt-4 text-white/85 max-w-lg">
                We reserve same-day appointments for emergencies. Call now — after hours, use our emergency line.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg" className="!bg-white !text-[--color-brand-700] !border-white">
                Call {site.phone}
              </Button>
              <a
                href={`tel:${site.emergencyTel}`}
                className="text-center py-3 rounded-full border border-white/40 hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                After hours: {site.emergencyPhone}
              </a>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
