import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Aurora, Colorado family & cosmetic dentistry`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inline color tokens (must mirror app/globals.css @theme block)
const T = {
  bg: "#FAFAF7",
  brand700: "#0A5C34",
  brand600: "#0C7A43",
  brand400: "#2DAE6B",
  brand100: "#D1EFDE",
  accent: "#9BCB24",
  ink900: "#121A1F",
  ink500: "#5F7180",
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${T.brand700} 0%, ${T.brand600} 55%, ${T.brand400} 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: 72,
          position: "relative",
          color: T.bg,
          fontFamily: "serif",
        }}
      >
        {/* aurora overlay blobs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 540,
            height: 540,
            borderRadius: 999,
            background: `radial-gradient(circle, ${T.accent}66 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -80,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: `radial-gradient(circle, ${T.brand100}44 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: T.brand100,
            display: "flex",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          Aurora, Colorado · Family + Cosmetic
        </div>

        {/* title */}
        <div
          style={{
            marginTop: 32,
            fontSize: 108,
            lineHeight: 1.05,
            letterSpacing: -3,
            fontWeight: 500,
            display: "flex",
            maxWidth: 980,
          }}
        >
          {site.name}
        </div>

        {/* tagline */}
        <div
          style={{
            marginTop: 24,
            fontSize: 38,
            lineHeight: 1.3,
            color: T.brand100,
            fontFamily: "sans-serif",
            fontWeight: 400,
            display: "flex",
            maxWidth: 920,
          }}
        >
          Friendly staff. Beautiful smiles. Welcoming environment.
        </div>

        {/* footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 26,
              color: T.bg,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: T.accent,
                display: "flex",
              }}
            />
            {site.phone}
          </div>
          <div
            style={{
              fontSize: 22,
              color: T.brand100,
              fontFamily: "sans-serif",
              fontWeight: 500,
              display: "flex",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            auroragentledentist.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
