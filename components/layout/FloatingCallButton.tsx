"use client";
import { m } from "framer-motion";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function FloatingCallButton() {
  return (
    <m.a
      href={`tel:${site.phoneTel}`}
      initial={{ scale: 0, y: 24 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      aria-label={`Call ${site.phone}`}
      className="lg:hidden fixed bottom-24 right-5 z-40 grid place-items-center w-14 h-14 rounded-full bg-(--color-brand-600) text-white shadow-(--shadow-soft-lg)"
    >
      <span className="absolute inset-0 rounded-full bg-(--color-accent) animate-ping opacity-30" />
      <Icon name="phone" className="w-6 h-6 relative" />
    </m.a>
  );
}
