import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

const ONE_YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  turbopack: {
    root,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 1 year — Next.js already content-hashes optimized image URLs
    minimumCacheTTL: ONE_YEAR,
    // Restrict device sizes to actual breakpoints to shrink generated variants
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Strip development-only React props from production bundle
  reactStrictMode: true,
  // Already trims response bytes; harmless to be explicit
  compress: true,
  experimental: {
    // Tailwind atomic CSS inlined into <head> — eliminates the render-blocking
    // stylesheet request for first-time visitors. Marketing-site ideal.
    inlineCss: true,
    // Tree-shake named imports from these libs so we only ship what we use
    optimizePackageImports: ["framer-motion", "@vercel/analytics", "@vercel/speed-insights"],
  },
  // Security + caching headers
  async headers() {
    return [
      {
        // Long-lived, content-hashed video assets
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        // Static images
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      {
        // Patient forms (PDFs). Without this they fall through to max-age=0
        // and the 2.7 MB health-history form is re-fetched on every visit.
        source: "/forms/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      {
        // Baseline security headers for HTML responses
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
