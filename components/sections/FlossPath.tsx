"use client";
import { useEffect, useId, useRef, useState } from "react";
import { m, useTransform, type MotionValue } from "framer-motion";
import { buildFlossPath, type SectionBounds } from "@/lib/floss-path";

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
  const d = buildFlossPath(sections);
  const filterId = useId();
  const sheenId = useId();

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [d]);

  const dashoffset = useTransform(progress, [0, 1], [length, 0]);
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
    [0, 0.85, 0.85, 0],
  );

  const twistDash = "1.4 2.8";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 hidden md:block"
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
        </filter>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FCFA0" />
          <stop offset="50%" stopColor="#1FA672" />
          <stop offset="100%" stopColor="#157A55" />
        </linearGradient>
      </defs>

      <m.path
        d={d}
        fill="none"
        stroke="#1FA672"
        strokeOpacity={0.18}
        strokeWidth={9}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={length || 1}
        style={{ strokeDashoffset: dashoffset, opacity: haloOpacity }}
      />

      <m.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={`url(#${sheenId})`}
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={length || 1}
        style={{ strokeDashoffset: dashoffset }}
      />

      <m.path
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.85}
        strokeWidth={0.9}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={twistDash}
        filter={`url(#${filterId})`}
        style={{
          strokeDashoffset: useTransform(progress, [0, 1], [length, 0]),
          opacity: useTransform(progress, [0, 0.04, 0.96, 1], [0, 0.7, 0.7, 0]),
        }}
      />

      <m.path
        d={d}
        fill="none"
        stroke="#E8FFF6"
        strokeOpacity={0.55}
        strokeWidth={0.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="0.6 4"
        style={{
          strokeDashoffset: useTransform(progress, [0, 1], [length / 2, 0]),
          opacity: useTransform(progress, [0, 0.05, 0.95, 1], [0, 0.55, 0.55, 0]),
        }}
      />

      <m.circle
        r={5}
        fill="#1FA672"
        fillOpacity={0.28}
        vectorEffect="non-scaling-stroke"
        style={{ cx: tipCx, cy: tipCy, opacity: tipOpacity }}
      />
      <m.circle
        r={2.4}
        fill="#FFFFFF"
        stroke="#1FA672"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        style={{ cx: tipCx, cy: tipCy, opacity: tipOpacity }}
      />
    </svg>
  );
}
