"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { m, useTransform, type MotionValue } from "framer-motion";
import {
  buildFlossPath,
  type AnchorRect,
  type SectionBounds,
  type WeaveCut,
} from "@/lib/floss-path";

export function FlossPath({
  height,
  sections,
  anchors,
  progress,
}: {
  height: number;
  sections: SectionBounds[];
  anchors: AnchorRect[];
  progress: MotionValue<number>;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const filterId = useId();
  const sheenId = useId();
  const shadeId = useId();
  const maskId = useId();

  const { d, weaveCuts } = useMemo(
    () => buildFlossPath(sections, anchors),
    [sections, anchors],
  );

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [d]);

  const dashoffset = useTransform(progress, [0, 1], [length, 0]);
  const haloOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 0.7, 0.7, 0]);
  const fiberOpacity = useTransform(progress, [0, 0.04, 0.96, 1], [0, 0.78, 0.78, 0]);
  const shimmerOffset = useTransform(progress, [0, 1], [length / 2, 0]);
  const shimmerOpacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 0.55, 0.55, 0]);
  const tipOpacity = useTransform(progress, [0, 0.01, 0.99, 1], [0, 1, 1, 0]);

  const tipCx = useTransform(progress, (v) => {
    if (!pathRef.current || length === 0) return 0;
    return pathRef.current.getPointAtLength(v * length).x;
  });
  const tipCy = useTransform(progress, (v) => {
    if (!pathRef.current || length === 0) return 0;
    return pathRef.current.getPointAtLength(v * length).y;
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 hidden md:block"
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-4%" y="-1%" width="108%" height="102%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
          <feOffset dx="0.6" dy="2.6" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
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
          <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>

        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1440"
          height={height}
        >
          <rect x="0" y="0" width="1440" height={height} fill="white" />
          {weaveCuts.map((c: WeaveCut, i: number) => (
            <ellipse
              key={i}
              cx={c.x}
              cy={c.y}
              rx={c.rx}
              ry={c.ry}
              fill="black"
              opacity="0.92"
            />
          ))}
        </mask>
      </defs>

      <g filter={`url(#${filterId})`}>
        <m.path
          d={d}
          fill="none"
          stroke="#0A2E22"
          strokeOpacity={0.4}
          strokeWidth={5.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={length || 1}
          style={{
            strokeDashoffset: dashoffset,
            opacity: haloOpacity,
            transform: "translate(0.4px, 1.4px)",
          }}
        />
        <m.path
          d={d}
          fill="none"
          stroke="#1FA672"
          strokeOpacity={0.22}
          strokeWidth={11}
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
            strokeWidth={3.6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={length || 1}
            style={{ strokeDashoffset: dashoffset }}
          />
          <m.path
            d={d}
            fill="none"
            stroke={`url(#${shadeId})`}
            strokeWidth={3.6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={length || 1}
            style={{
              strokeDashoffset: dashoffset,
              mixBlendMode: "overlay",
              opacity: 0.95,
            }}
          />
          <m.path
            d={d}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={0.9}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="1.4 3"
            style={{
              strokeDashoffset: dashoffset,
              opacity: fiberOpacity,
              transform: "translate(-0.4px, -0.5px)",
            }}
          />
          <m.path
            d={d}
            fill="none"
            stroke="#E8FFF6"
            strokeWidth={0.55}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0.6 4.5"
            style={{
              strokeDashoffset: shimmerOffset,
              opacity: shimmerOpacity,
            }}
          />
        </g>
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
