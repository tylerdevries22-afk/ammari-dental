"use client";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export function SplitText({
  text,
  className,
  as = "h2",
  stagger = 0.045,
  delay = 0,
  amount = 0.4,
  once = true,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = m[as];
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]"
        >
          <m.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "115%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
            {i < words.length - 1 && "\u00A0"}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
