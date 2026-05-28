import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: "linear-gradient(135deg, #0C7A43 0%, #0A5C34 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAFAF7",
          fontFamily: "serif",
          letterSpacing: "-0.04em",
          borderRadius: 40,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
