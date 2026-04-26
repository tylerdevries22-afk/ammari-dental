"use client";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, stagger, reveal } from "@/lib/motion";

const staff: { name: string; role: string; image?: string }[] = [
  { name: "Dr. Raed Ammari", role: "Dentist, Owner", image: "/images/staff/dr-ammari.webp" },
  { name: "Front Office Team", role: "Scheduling & Insurance" },
  { name: "Dental Hygienists", role: "Cleanings & Prevention" },
  { name: "Dental Assistants", role: "Chairside Support" },
];

export function StaffStrip() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Learn who we are"
          title="Meet Our Staff"
          description="A welcoming, experienced team committed to making every visit comfortable."
        />
        <m.ul
          variants={stagger(0.07)}
          initial={reveal.initial}
          whileInView={reveal.whileInView}
          viewport={reveal.viewport}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {staff.map((s) => (
            <m.li
              key={s.name}
              variants={fadeUp}
              className="rounded-2xl overflow-hidden bg-white border border-[--color-brand-100]"
            >
              <div className="relative aspect-[4/5] bg-gradient-to-br from-[--color-brand-100] via-white to-[--color-brand-50] grid place-items-center overflow-hidden">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={`${s.name} — ${s.role}`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid place-items-center w-20 h-20 rounded-full bg-white shadow-[--shadow-soft-md] text-[--color-brand-700]">
                    <Icon name="smile" className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="font-display text-lg">{s.name}</div>
                <div className="text-xs text-[--color-ink-500] mt-1">{s.role}</div>
              </div>
            </m.li>
          ))}
        </m.ul>
        <div className="mt-10 text-center">
          <Link
            href="/dental-staff"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[--color-brand-700] hover:text-[--color-brand-600]"
          >
            See the full team <Icon name="arrow" className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
