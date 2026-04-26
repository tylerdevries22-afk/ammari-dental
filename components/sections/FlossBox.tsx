"use client";
import { m, useTransform, type MotionValue } from "framer-motion";

export function FlossBox({ progress }: { progress: MotionValue<number> }) {
  const lidRotate = useTransform(progress, [0, 0.025, 0.06], [0, -28, -42]);
  const spoolRotate = useTransform(progress, [0, 0.08, 1], [0, 90, 1080]);
  const tailDraw = useTransform(progress, [0, 0.04, 0.08], [0, 0.6, 1]);
  const boxFloat = useTransform(progress, [0, 0.05, 0.08], [4, 0, -2]);
  const labelShine = useTransform(progress, [0, 0.04, 0.08], [0, 0.4, 0.8]);

  return (
    <div className="absolute top-0 right-0 w-full h-screen pointer-events-none z-20 hidden md:block">
      <div className="sticky top-24 flex justify-end pr-6 lg:pr-12">
        <m.svg
          width="124"
          height="148"
          viewBox="0 0 124 148"
          style={{ y: boxFloat }}
          className="drop-shadow-[0_18px_40px_rgba(15,54,51,0.35)]"
          aria-hidden
        >
          <defs>
            <linearGradient id="flossBoxBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1F635E" />
              <stop offset="55%" stopColor="#154944" />
              <stop offset="100%" stopColor="#0F3633" />
            </linearGradient>
            <linearGradient id="flossBoxSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flossBoxLid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F635E" />
              <stop offset="100%" stopColor="#0A2624" />
            </linearGradient>
            <linearGradient id="flossSpool" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ECF5F4" />
              <stop offset="100%" stopColor="#A6D2CD" />
            </linearGradient>
          </defs>

          <rect
            x="14"
            y="46"
            width="96"
            height="86"
            rx="14"
            fill="url(#flossBoxBody)"
          />
          <rect
            x="14"
            y="46"
            width="96"
            height="86"
            rx="14"
            fill="url(#flossBoxSheen)"
          />
          <rect
            x="22"
            y="68"
            width="80"
            height="38"
            rx="6"
            fill="#FAFAF7"
            opacity="0.96"
          />
          <text
            x="62"
            y="86"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            letterSpacing="2"
            fill="#1F635E"
            fontFamily="ui-sans-serif, system-ui"
          >
            AMMARI
          </text>
          <text
            x="62"
            y="100"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            letterSpacing="1"
            fill="#0F3633"
            fontFamily="ui-sans-serif, system-ui"
          >
            FLOSS
          </text>
          <m.rect
            x="22"
            y="68"
            width="80"
            height="38"
            rx="6"
            fill="white"
            style={{ opacity: labelShine, mixBlendMode: "overlay" }}
          />

          <rect
            x="20"
            y="118"
            width="84"
            height="6"
            rx="3"
            fill="#0A2624"
            opacity="0.6"
          />

          <rect x="40" y="40" width="44" height="10" rx="3" fill="#0A2624" />
          <m.circle
            cx="62"
            cy="48"
            r="7"
            fill="url(#flossSpool)"
            style={{ rotate: spoolRotate, transformOrigin: "62px 48px" }}
          />
          <m.line
            x1="62"
            y1="48"
            x2="62"
            y2="48"
            stroke="#3F948C"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ rotate: spoolRotate, transformOrigin: "62px 48px" }}
            transform="translate(0,0)"
          />

          <m.g style={{ rotate: lidRotate, transformOrigin: "20px 40px" }}>
            <rect
              x="14"
              y="30"
              width="96"
              height="16"
              rx="6"
              fill="url(#flossBoxLid)"
            />
            <rect
              x="14"
              y="30"
              width="96"
              height="6"
              rx="3"
              fill="#ffffff"
              opacity="0.18"
            />
            <rect x="50" y="32" width="24" height="4" rx="2" fill="#0A2624" />
          </m.g>

          <m.path
            d="M 62 48 C 78 56, 96 60, 110 70"
            fill="none"
            stroke="#1FA672"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            style={{ pathLength: tailDraw }}
          />
        </m.svg>
      </div>
    </div>
  );
}
