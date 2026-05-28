import { SPLASH_LOGO } from "@/lib/splashLogo";
import { SPLASH_POSTER } from "@/lib/splashPoster";

/**
 * First-paint brand splash built around the real logo-reveal video, optimized
 * from 3.6 MB → ~35 KB (trimmed to the 3s reveal, 400px, H.264). Pure CSS, no
 * JS:
 *  - An inlined first-frame poster (data URI) paints instantly, so there's no
 *    blank flash before the 35 KB clip arrives.
 *  - The video autoplays (muted + playsinline) the glossy reveal.
 *  - "AMMARI DENTAL" reveals beneath it, then the whole overlay fades out and
 *    self-dismisses via animation-fill-mode (~3.4s total).
 *  - prefers-reduced-motion: the video is dropped entirely (not even fetched)
 *    and the static formed logo shows with a short fade.
 *
 * Decorative + aria-hidden, so it never affects focus order. Lives in the root
 * layout → plays on every full page load, not on client-side route changes.
 */
export function SplashScreen() {
  return (
    <div className="am-splash" aria-hidden="true" role="presentation">
      <div className="am-splash__lockup">
        <div className="am-splash__mark">
          {/* eslint-disable-next-line @next/next/no-img-element -- reduced-motion fallback, inlined */}
          <img className="am-splash__static" src={SPLASH_LOGO} alt="" width={144} height={144} decoding="sync" />
          <video
            className="am-splash__video"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={SPLASH_POSTER}
            width={400}
            height={400}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/videos/logo-splash.mp4" type="video/mp4" />
          </video>
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
          /* Soft brand-tinted wash; the white rounded card sits on top of it. */
          background: radial-gradient(circle at 50% 46%, var(--color-brand-50), var(--color-bg) 72%);
          animation: am-splash-out 3400ms ease-in-out both;
          will-change: opacity;
        }
        .am-splash__lockup { display: flex; flex-direction: column; align-items: center; gap: clamp(16px, 2.6vw, 24px); }
        .am-splash__mark {
          position: relative;
          width: clamp(132px, 19vw, 176px);
          aspect-ratio: 1;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-brand-100);
          box-shadow: var(--shadow-soft-md);
          animation: am-splash-pop 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .am-splash__static { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 1; }
        .am-splash__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .am-splash__word { display: flex; flex-direction: column; align-items: center; line-height: 1; }
        .am-splash__word-1 {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(24px, 4.6vw, 38px);
          letter-spacing: 0.06em;
          color: var(--color-ink-900);
          opacity: 0;
          animation: am-splash-word 520ms cubic-bezier(0.22, 1, 0.36, 1) 1500ms both;
        }
        .am-splash__word-2 {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(11px, 2vw, 15px);
          color: var(--color-ink-500);
          margin-top: 0.55em;
          text-indent: 0.34em;
          opacity: 0;
          animation: am-splash-track 620ms cubic-bezier(0.22, 1, 0.36, 1) 1700ms both;
        }
        @keyframes am-splash-out {
          0%, 88% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes am-splash-pop {
          0% { opacity: 0; transform: scale(0.86); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes am-splash-word {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes am-splash-track {
          0% { opacity: 0; letter-spacing: 0; }
          100% { opacity: 1; letter-spacing: 0.34em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .am-splash { animation: am-splash-out 280ms ease-out both; }
          .am-splash__mark { animation: none; }
          .am-splash__video { display: none; }
          .am-splash__word-1 { animation: none; opacity: 1; transform: none; }
          .am-splash__word-2 { animation: none; opacity: 1; letter-spacing: 0.34em; }
        }
      `}</style>
    </div>
  );
}
