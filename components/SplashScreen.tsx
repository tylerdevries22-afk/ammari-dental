import { SPLASH_LOGO } from "@/lib/splashLogo";

/**
 * Premium first-paint brand splash — the full Ammari Dental lockup with a
 * staged, glossy reveal that echoes the logo video, built in pure CSS (no JS,
 * no network) so it paints on the first frame. The logo is an inlined base64
 * WebP, used both as the <img> and as the mask for a light "shine" sweep that
 * travels across the mark's silhouette (the glossy effect, masked to the logo
 * shape so it never reads as a rectangle).
 *
 * Sequence (~1.5s): mark pops in → shine sweeps across it → "AMMARI" rises in
 * → "DENTAL" expands its tracking → brief hold → whole overlay fades out,
 * self-dismissing via animation-fill-mode (ends hidden + pointer-events:none).
 *
 * Honors prefers-reduced-motion (short motionless fade). Decorative +
 * aria-hidden so it never affects focus order. Lives in the root layout, so
 * it plays on every full page load but not on client-side route changes.
 */
export function SplashScreen() {
  return (
    <div className="am-splash" aria-hidden="true" role="presentation">
      <div className="am-splash__lockup">
        <div className="am-splash__mark">
          {/* eslint-disable-next-line @next/next/no-img-element -- inlined data URI, must paint at first frame with no loader */}
          <img className="am-splash__logo" src={SPLASH_LOGO} alt="" width={132} height={132} decoding="sync" />
          <span className="am-splash__shine" />
        </div>
        <div className="am-splash__word">
          <span className="am-splash__word-1">AMMARI</span>
          <span className="am-splash__word-2">DENTAL</span>
        </div>
      </div>
      <style>{`
        .am-splash {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 42%, var(--color-brand-50), var(--color-bg) 72%);
          animation: am-splash-out 1500ms ease-in-out both;
          will-change: opacity;
        }
        .am-splash__lockup {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(14px, 2.3vw, 22px);
        }
        .am-splash__mark {
          position: relative;
          isolation: isolate;
          width: clamp(96px, 15vw, 132px);
          aspect-ratio: 1;
          animation: am-splash-pop 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .am-splash__logo { display: block; width: 100%; height: 100%; object-fit: contain; }
        .am-splash__shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 43%,
            var(--color-surface) 50%,
            transparent 57%
          );
          background-repeat: no-repeat;
          background-size: 230% 100%;
          -webkit-mask: url("${SPLASH_LOGO}") center / contain no-repeat;
          mask: url("${SPLASH_LOGO}") center / contain no-repeat;
          mix-blend-mode: screen;
          animation: am-splash-shine 820ms ease-out 240ms both;
        }
        .am-splash__word { display: flex; flex-direction: column; align-items: center; line-height: 1; }
        .am-splash__word-1 {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(26px, 5vw, 40px);
          letter-spacing: 0.06em;
          color: var(--color-ink-900);
          opacity: 0;
          animation: am-splash-word 500ms cubic-bezier(0.22, 1, 0.36, 1) 420ms both;
        }
        .am-splash__word-2 {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(12px, 2.1vw, 16px);
          color: var(--color-ink-500);
          margin-top: 0.55em;
          text-indent: 0.34em;
          opacity: 0;
          animation: am-splash-track 600ms cubic-bezier(0.22, 1, 0.36, 1) 560ms both;
        }
        @keyframes am-splash-out {
          0%, 72% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes am-splash-pop {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes am-splash-shine {
          0% { background-position: 175% 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { background-position: -75% 0; opacity: 0; }
        }
        @keyframes am-splash-word {
          0% { opacity: 0; transform: translateY(9px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes am-splash-track {
          0% { opacity: 0; letter-spacing: 0; }
          100% { opacity: 1; letter-spacing: 0.34em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .am-splash { animation: am-splash-out 240ms ease-out both; }
          .am-splash__mark,
          .am-splash__word-1 { animation: none; opacity: 1; transform: none; }
          .am-splash__word-2 { animation: none; opacity: 1; letter-spacing: 0.34em; }
          .am-splash__shine { display: none; }
        }
      `}</style>
    </div>
  );
}
