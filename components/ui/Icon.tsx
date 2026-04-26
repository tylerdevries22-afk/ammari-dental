import type { SVGProps } from "react";

const paths: Record<string, string> = {
  tooth:
    "M12 3c-3 0-5 2-5 5 0 2 .5 3 .5 5s-.5 4-.5 6 1 2 2 2 1.5-1 1.5-3 0-3 1.5-3 1.5 1 1.5 3 .5 3 1.5 3 2 0 2-2-.5-4-.5-6 .5-3 .5-5c0-3-2-5-4.5-5z",
  heart:
    "M12 21s-7-4.5-7-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 6-9 10.5-9 10.5z",
  alert:
    "M12 3 2 21h20L12 3zm0 6v6m0 4h.01",
  sparkle:
    "M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z",
  brush:
    "M4 20l8-8m4-4l-2-2m2 2l4 4-4 4-4-4 4-4z",
  shield:
    "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  crown:
    "M3 18h18M5 8l3 5 4-7 4 7 3-5v10H5V8z",
  bridge:
    "M3 12h18M6 12V8m12 4V8M6 12v6h12v-6",
  layers:
    "M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 17l9 5 9-5",
  pulse:
    "M3 12h4l2-7 4 14 2-7h6",
  droplet:
    "M12 3s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12z",
  leaf:
    "M5 21c0-9 7-16 16-16-1 9-7 16-16 16zM5 21l9-9",
  moon:
    "M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z",
  anchor:
    "M12 3v18m-7-9h14M5 12a7 7 0 0 0 14 0M9 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0z",
  link:
    "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1m-2 7a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  smile:
    "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  scissors:
    "M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12",
  "scissors-stack":
    "M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  calendar:
    "M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 2v4M16 2v4",
  arrow:
    "M5 12h14m-6-7 7 7-7 7",
  star:
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

export function Icon({
  name,
  className,
  ...props
}: { name: string; className?: string } & SVGProps<SVGSVGElement>) {
  const d = paths[name] ?? paths.tooth;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
