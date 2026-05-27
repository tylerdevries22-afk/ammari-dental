import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Ammari",
    description: "Ammari Dental — Aurora CO family & cosmetic dentistry",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#1F635E",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
