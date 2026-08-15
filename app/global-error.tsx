"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It
 * replaces the whole document, so it must render its own <html>/<body> and
 * cannot rely on the app's fonts or providers — styles are inlined.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#FAFAF7",
          color: "#1E2A24",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 1rem" }}>
            We hit a snag
          </h1>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            Please try again. To reach us right away, call{" "}
            <a href={`tel:${site.phoneTel}`} style={{ color: "#2F6B4F", fontWeight: 600 }}>
              {site.phone}
            </a>
            .
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0 1.5rem",
              height: "2.75rem",
              borderRadius: "999px",
              border: "none",
              background: "#2F6B4F",
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
