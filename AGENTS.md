<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design system (Tailwind v4 CSS-first)

All design tokens live in `app/globals.css` inside the `@theme` block. Reference them via Tailwind's arbitrary-property syntax: `text-(--color-brand-700)`, `bg-(--surface-glass)`, `shadow-(--shadow-soft-md)`, `rounded-(--radius-xl)`, etc.

### Token families

- **Colors**: `--color-brand-{50..900}`, `--color-accent{,-50,-100,-300,-500,-600}`, `--color-sage-{100,300,500}`, `--color-ink-{200..900}`, semantic (`--color-success`, `--color-warning`, `--color-danger`)
- **Surfaces**: `--color-bg`, `--color-surface`, `--color-surface-muted`, `--color-surface-warm`, `--surface-glass`, `--surface-glass-dark`, `--surface-deep`, `--surface-inverse`, `--surface-data`
- **Typography scale**: `--text-xs` through `--text-display` (fluid, clamp-driven)
- **Line-height**: `--leading-tight|snug|normal|relaxed|prose`
- **Letter-spacing**: `--tracking-tightest|tight|normal|wide|widest`
- **Font-weight**: `--weight-regular|medium|semibold|bold`
- **Radius**: `--radius-sm|md|lg|xl|pill`
- **Shadows**: `--shadow-soft-sm|md|lg`, `--shadow-glow`
- **Motion easing**: `--ease-out|in-out|spring|snap`
- **Motion duration**: `--duration-fast|base|slow|deliberate`
- **Z-index scale**: `--z-base|rise|sticky|overlay|header|cursor|progress|modal|skip`

### Utilities

- `.eyebrow` — uppercase small-caps eyebrow text
- `.data-mono` — monospaced uppercase data lockup
- `.num-tabular` — tabular-nums for stat counters
- `.glass`, `.glass-dark` — frosted surfaces
- `.noise-overlay` — film-grain SVG noise overlay
- `.aurora-gradient`, `.text-aurora` — brand gradient backgrounds + text
- `.mask-fade-b` — bottom-mask reveal
- `.anchor-offset` — `scroll-margin-top: 96px` for sticky-header-friendly anchors

### Hard rules

- **NEVER use Tailwind named colors** (`text-green-600`, `bg-white`, `text-black`, etc.) — every color must reference a `--color-*` token.
- **NEVER hard-code hex values** in component code. Only exceptions: `lib/email-tokens.ts` (email clients don't support CSS vars) and inline tokens in `app/opengraph-image.tsx` / `app/apple-icon.tsx` (next/og runs server-side and can't read computed styles).
- All headings use `--font-display` (Fraunces); body uses `--font-sans` (Inter); credentials/data use `--font-mono`.

## Motion contract

Single source of truth is `lib/useMotion.ts`. Read `{ reduced, enabled, scrubFactor, duration }` from it. Three reduced-motion sources are combined:

1. OS `prefers-reduced-motion` (Framer's `useReducedMotion`)
2. Manual `<html data-motion="reduce">` attribute (writable via user toggle)
3. Component-level overrides via prop

All scroll-driven, cursor-driven, and timeline-driven effects must check `useMotion().enabled` and bail to a static fallback otherwise.

## Animation stack

- **Framer Motion** — declarative element animations, layout transitions
- **GSAP + ScrollTrigger** (`lib/gsap.ts`) — scroll-driven scrubbing, pinning, complex timelines
- **Lenis** (`components/providers/SmoothScroll.tsx`) — smooth scroll, wired to ScrollTrigger via `lenis.on("scroll", ScrollTrigger.update)`

Mount progressive enhancements via `components/providers/ClientEnhancements.tsx`, which uses `next/dynamic({ ssr: false })` to defer their JS chunks past first paint.

## Performance contract

- Images: `next/image` with explicit `sizes`, `width`, `height`. `priority` + `fetchPriority="high"` only on LCP element. No `unoptimized`.
- Static assets: `/videos/*` and `/images/*` get 1-year immutable cache headers in `next.config.ts`.
- `experimental.inlineCss: true` inlines Tailwind CSS into `<head>` on first load — keep an eye on `<style>` size if tokens balloon.
- `experimental.optimizePackageImports` covers framer-motion + analytics packages — add more named-import-heavy libs here.
- LCP target: ≤ 2.5s mobile 4G. Defer below-the-fold heavy components (e.g. `AppointmentForm`) via `next/dynamic`.
- Video scrub: source must be every-frame IDR (`x264opts keyint=1`) for frame-perfect seeking. Provide a `.vtt` captions track to satisfy axe-core's `video-caption` critical rule even when `aria-hidden`.

## Accessibility contract

- Axe scans (serious + critical) gate the CI e2e job. Pages tested: `/`, `/dental-services`, `/dental-implants`, `/appointment`, `/contact`.
- `<a class="skip-link">Skip to content</a>` must remain the **first focusable element** in DOM order — `ClientEnhancements` is intentionally mounted AFTER Header/main/Footer/FloatingCallButton to preserve this.
- Decorative videos: `aria-hidden`, `muted`, `playsInline`, plus an empty captions track.
- Every interactive element must have a visible focus ring (`:focus-visible` base style applies `outline: 2px solid var(--color-brand-500)`).

## CI

- `build` job: `npm ci` → `npm run lint` (max-warnings=0) → `npm run build` → SEO snapshot diff
- `e2e` job: chromium + Pixel 7 projects. Specs in `tests/playwright/{a11y,seo}.spec.ts`. Browsers installed in-job via `npx playwright install --with-deps chromium`.

## Sections + chapter markers

The homepage uses `[data-chapter]` + `id` attributes on its key sections so `components/effects/SectionScrollIndicator.tsx` auto-discovers them and renders a right-margin chapter bar (xl+ only). Currently tagged: `#welcome`, `#by-the-numbers`, `#services`, `#about`, `#reviews`, `#team`, `#visit`. Add new chapters by setting both `id` and `data-chapter` on a `<section>` inside `<main>`.
