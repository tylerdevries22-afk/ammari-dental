"use client";
import { useEffect, useRef, useState } from "react";
import { m, useTransform, type MotionValue } from "framer-motion";
import { buildFlossPath } from "@/lib/floss-path";

export function FlossPath({
  height,
  progress,
}: {
  height: number;
  progress: MotionValue<number>;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const d = buildFlossPath(height);

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

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 hidden md:block"
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <m.path
        d={d}
        fill="none"
        stroke="white"
        strokeOpacity={0.5}
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={length || 1}
        style={{ strokeDashoffset: dashoffset }}
      />
      <m.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="#1FA672"
        strokeWidth={2.25}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={length || 1}
        style={{ strokeDashoffset: dashoffset }}
      />
      <m.circle
        r={4}
        fill="#1FA672"
        stroke="white"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        style={{ cx: tipCx, cy: tipCy, opacity: tipOpacity }}
      />
    </svg>
  );
}
