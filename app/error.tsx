"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Route-level error boundary. Without this, any throw in a route or client
 * component dropped the visitor onto Next's unstyled default error page with
 * no way to reach the practice.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] grid place-items-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="eyebrow text-(--color-brand-600)">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl text-(--color-ink-900)">
          We hit a snag loading this page
        </h1>
        <p className="mt-4 text-(--color-ink-700)">
          Please try again. If you need to reach us right away, call{" "}
          <a
            href={`tel:${site.phoneTel}`}
            className="text-(--color-brand-700) font-semibold underline"
          >
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 h-11 rounded-(--radius-pill) bg-(--color-brand-600) text-(--color-surface) font-semibold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 h-11 grid place-items-center rounded-(--radius-pill) border border-(--color-brand-200) text-(--color-brand-700) font-semibold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
