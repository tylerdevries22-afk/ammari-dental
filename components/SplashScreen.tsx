import { SPLASH_LOGO } from "@/lib/splashLogo";

/**
 * First-paint brand splash. Pure CSS (no JS, no network) so it renders the
 * instant the HTML paints and self-dismisses via animation-fill-mode within
 * ~460ms — comfortably under the half-second budget. The logo is an inlined
 * base64 WebP (zero fetch). Honors prefers-reduced-motion with a short,
 * motionless fade. Decorative + aria-hidden, so it never affects focus order.
 *
 * Rendered in the root layout, so it plays on every full page load but not on
 * client-side route changes (the layout subtree persists across soft nav).
 */
export function SplashScreen() {
  return (
    <div className="am-splash" aria-hidden="true" role="presentation">
      {/* eslint-disable-next-line @next/next/no-img-element -- inlined data URI, must paint at first frame with no loader */}
      <img className="am-splash__logo" src={SPLASH_LOGO} alt="" width={120} height={120} decoding="sync" />
      <style>{`
        .am-splash {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 44%, var(--color-brand-50), var(--color-bg) 72%);
          animation: am-splash-out 460ms ease-in both;
          will-change: opacity;
        }
        .am-splash__logo {
          width: clamp(92px, 17vw, 128px);
          height: auto;
          object-fit: contain;
          animation: am-splash-pop 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        @keyframes am-splash-out {
          0%, 60% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes am-splash-pop {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; }
          100% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .am-splash { animation: am-splash-out 200ms ease-out both; }
          .am-splash__logo { animation: none; }
        }
      `}</style>
    </div>
  );
}
