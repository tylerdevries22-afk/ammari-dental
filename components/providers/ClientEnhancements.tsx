"use client";
import dynamic from "next/dynamic";

/**
 * Progressive enhancements — defer past first paint so they don't add weight
 * to the LCP-critical bundle. All three respect prefers-reduced-motion and
 * are no-op during SSR.
 *
 * Wrapped in a client component because `next/dynamic` with `ssr: false`
 * is not allowed in Server Components in Next.js 16.
 */
const SmoothScroll = dynamic(
  () => import("./SmoothScroll").then((m) => m.SmoothScroll),
  { ssr: false },
);
const AmbientCursor = dynamic(
  () => import("@/components/effects/AmbientCursor").then((m) => m.AmbientCursor),
  { ssr: false },
);
const SectionScrollIndicator = dynamic(
  () =>
    import("@/components/effects/SectionScrollIndicator").then(
      (m) => m.SectionScrollIndicator,
    ),
  { ssr: false },
);

export function ClientEnhancements() {
  return (
    <>
      <SmoothScroll />
      <AmbientCursor />
      <SectionScrollIndicator />
    </>
  );
}
