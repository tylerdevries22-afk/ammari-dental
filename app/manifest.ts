import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Ammari",
    description: "Ammari Dental — Aurora CO family & cosmetic dentistry",
    start_url: "/",
    display: "standalone",
    // PWA manifest needs literal colors (can't read CSS vars); keep these in
    // sync with --color-bg and --color-brand-600 in app/globals.css.
    background_color: "#FAFAF7",
    theme_color: "#0C7A43",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
