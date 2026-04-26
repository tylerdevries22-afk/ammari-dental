"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { m, useTransform, type MotionValue } from "framer-motion";
import {
  buildFlossPath,
  type SectionBounds,
  type WeavePoint,
} from "@/lib/floss-path";

export function FlossPath({
  height,
  sections,
  progress,
}: {
  height: number;
  sections: SectionBounds[];
  progress: MotionValue<number>;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const filterId = useId();
  const sheenId = useId();
  const shadeId = useId();
  const maskId = useId();

  const { d, weavePoints } = useMemo(
    () => buildFlossPath(sections),
    [sections],
  );

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [d]);

  const dashoffset = useTransform(progress, [0, 1], [length, 0]);
  const sheenOffset = useTransform(progress, [0, 1], [length, 0]);
  const shimmerOffset = useTransform(progress, [0, 1], [length / 2, 0]);

  const tipOpacity = useTransform(progress, [0, 0.01, 0.99, 1], [0, 1, 1, 0]);
  const tipCx = useTransform(progress, (v) => {
    if (!pathRef.current || length === 0) return 0;
    const pt = pathRef.current.getPointAtLength(v * length);
    return pt.x;
  });
  const tipCy = useTransform(progress, (v) => {
    if (!pathRef.current || length === 0) return 0;
    const pt = pathRef.current.getPointAtLength(v * length);
    return pt.y;
  });
  const haloOpacity = useTransform(
    progress,
    [0, 0.02, 0.98, 1],
    [0, 0.7, 0.7, 0],
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 hidden md:block"
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-10%" y="-2%" width="120%" height="104%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
          <feOffset dx="0.6" dy="2.2" result="shadowOut" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FCFA0" />
          <stop offset="50%" stopColor="#1FA672" />
          <stop offset="100%" stopColor="#0E5B40" />
        </linearGradient>

        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height={height}>
          <rect x="0" y="0" width="1440" height={height} fill="white" />
          {weavePoints.map((wp: WeavePoint, i: number) => (
            <ellipse
              key={i}
              cx="720"
              cy={wp.y}
              rx="300"
              ry="14"
              fill="black"
              opacity="0.85"
            />
          ))}
        </mask>
      </defs>

      <g filter={`url(#${filterId})`}>
        <m.path
          d={d}
          fill="none"
          stroke="#0A2E22"
          strokeOpacity={0.35}
          strokeWidth={6.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={length || 1}
          style={{
            strokeDashoffset: dashoffset,
            opacity: haloOpacity,
            transform: "translate(0.4px, 1.2px)",
          }}
        />

        <m.path
          d={d}
          fill="none"
          stroke="#1FA672"
          strokeOpacity={0.22}
          strokeWidth={10}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={length || 1}
          style={{ strokeDashoffset: dashoffset, opacity: haloOpacity }}
        />

        <g mask={`url(#${maskId})`}>
          <m.path
            ref={pathRef}
            d={d}
            fill="none"
            stroke={`url(#${sheenId})`}
            strokeWidth={3.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={length || 1}
            style={{ strokeDashoffset: dashoffset }}
          />

          <m.path
            d={d}
            fill="none"
            stroke={`url(#${shadeId})`}
            strokeWidth={3.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={length || 1}
            style={{
              strokeDashoffset: dashoffset,
              mixBlendMode: "overlay",
              opacity: 0.9,
            }}
          />
        </g>

        <m.path
          d={d}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.9}
          strokeWidth={0.85}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="1.6 3.2"
          style={{
            strokeDashoffset: sheenOffset,
            opacity: useTransform(
              progress,
              [0, 0.04, 0.96, 1],
              [0, 0.7, 0.7, 0],
            ),
            transform: "translate(-0.4px, -0.5px)",
          }}
        />

        <m.path
          d={d}
          fill="none"
          stroke="#E8FFF6"
          strokeOpacity={0.55}
          strokeWidth={0.55}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="0.6 4.5"
          style={{
            strokeDashoffset: shimmerOffset,
            opacity: useTransform(
              progress,
              [0, 0.05, 0.95, 1],
              [0, 0.55, 0.55, 0],
            ),
          }}
        />
      </g>

      <m.circle
        r={6}
        fill="#1FA672"
        fillOpacity={0.22}
        vectorEffect="non-scaling-stroke"
        style={{ cx: tipCx, cy: tipCy, opacity: tipOpacity }}
      />
      <m.circle
        r={2.6}
        fill="#FFFFFF"
        stroke="#1FA672"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        style={{ cx: tipCx, cy: tipCy, opacity: tipOpacity }}
      />
    </svg>
  );
}
