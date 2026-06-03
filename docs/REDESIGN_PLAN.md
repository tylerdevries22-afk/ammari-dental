# Ammari Dental — Complete Redesign Plan
**Source:** https://www.auroragentledentist.com
**Location:** Aurora, CO  |  **Practitioner:** Dr. Raed Ammari
**Plan date:** 2026-04-25
**Mandate:** Total UI/UX/Performance overhaul. Preserve 100% of SEO surface (URLs, slugs, copy, titles, meta, schema, heading hierarchy, internal links).

---

## TABLE OF CONTENTS
1. Phase 1 — Full Site Audit & Sitemap
2. Phase 2 — UX / Design Audit Findings
3. Phase 3 — Redesign Strategy & Design System
4. Phase 4 — Animation System (Framer Motion)
5. Phase 5 — Performance Optimization Plan
6. Phase 6 — Technical Implementation (File & Component Architecture)
7. Phase 7 — QA Checklist (40+ items)
8. Implementation Roadmap (8-week plan)

---

## PHASE 1 — FULL SITE AUDIT & SITEMAP

### 1.1 Stack Detected on Live Site
- **CMS / Platform:** Officite (legacy template-driven dental CMS)
- **Reviews widget:** BirdEye
- **Maps:** Google Maps embed
- **Booking:** No real-time scheduler — static appointment-request form
- **Chat:** None
- **Analytics:** Not visible client-side (assume GA Universal/legacy)
- **Render:** Server-rendered HTML, jQuery-era patterns, no SPA framework

### 1.2 Authoritative Sitemap (preserve every URL exactly)

```
/                                           Homepage
/appointment                                Appointment request
/contact                                    Contact
/new-patients                               New patient overview
/-new-patient-forms                         Forms (note leading dash — preserve)
/our-dental-office-location                 Location page
/dental-staff                               Meet the team
/gallery                                    Photo gallery
/reviews                                    Reviews (BirdEye)
/testimonials                               Testimonials

SERVICES (16)
/dental-services                            Hub
/comfortable-dentistry
/dental-emergencies
/teeth-whitening
/bonding
/tooth-colored-fillings
/dental-crowns
/bridges
/veneers
/root-canal
/deep-cleaning
/preventative-periodontics
/night-guards
/dental-implants
/implant-dentures
/dentures
/extractions
/multiple-tooth-extractions

POST-OP / SURGICAL
/before-anesthesia
/surgical-instructions
/after-dental-implant-surgery
/after-impacted-tooth
/after-wisdom-tooth-removal
/post-op-instructions

INFO / RESOURCES
/-improving-your-smile        (preserve leading dash)
/-q---a                       (preserve leading dash)
/financing
/educational-videos
/links
/privacy
/notice-of-non-discrimination

EDUCATIONAL ARTICLES (~80 URLs each, preserve all)
/articles/general/*
/articles/baystone_curated_content/*
/articles/premium_education/*
/articles/ada/*
/articles/dear_doctor_spanish/*
/articles/dear_doctor_biohorizons_education_library/*
/articles/aad_education_library/*
/articles/aohns_patient_education/*
/articles/asge_education_library/*
/articles/acfas/*
/articles/officite_aap/*
```

**SEO note:** URLs with leading dashes and irregular slugs (`/-q---a`, `/-new-patient-forms`) are ranking artifacts of the Officite template. **Do not normalize them.** Preserve verbatim or implement 301s only if every external citation is mapped.

### 1.3 Heading Inventory (Homepage — preserve order)
- H1: "Friendly Staff. Beautiful Smiles. Welcoming Environment."
- H2s: Featured Services • Dental Emergency • We'll Provide You With That Winning Smile! • Appointment Request • Meet Our Staff • Testimonials • Featured Articles • Location & Hours
- H3s: Click to find out more • Send Us An Email Today • Learn Who We Are • What Our Clients Say About Us • Read about helpful topics • Our Location • Hours of Operation

### 1.4 Conversion Flow (current)
1. Land on home → 2. Hero carousel (4 rotating slides) → 3. Service grid → 4. Welcome blurb → 5. Static appointment form OR phone (303) 283-8009. **No instant scheduling, no SMS, no live chat.**

### 1.5 NAP & Trust Anchors (preserve in schema + footer)
- Phone: (303) 283-8009
- Fax: (303) 337-7809
- After-hours emergency: 720-443-8178
- Address: 1344 S Chambers Road, Suite 203, Aurora, CO 80017
- Hours: Mon–Thu 8:30a–5p • Fri 10a–3p (one Fri/mo closed) • Sat–Sun closed
- 18 insurance carriers (Aetna, Delta, Cigna, UHC, Medicaid, …)

---

## PHASE 2 — UX / DESIGN AUDIT FINDINGS

### 2.1 Critical Issues
| # | Severity | Issue | Impact |
|---|----------|-------|--------|
| 1 | 🔴 High | Hero is a 4-slide carousel with low contrast text on photographic backgrounds | LCP harmed; users miss CTA; carousels score ~1% engagement |
| 2 | 🔴 High | Primary CTA ("Make an Appointment") competes with 12+ nav items and BirdEye widget | Decision paralysis; conversion friction |
| 3 | 🔴 High | No sticky header / no floating mobile call button | Lost mobile calls (>60% of dental traffic) |
| 4 | 🔴 High | Appointment form is template-rendered, no field validation, no HIPAA notice, no confirmation UX | Trust + compliance gap |
| 5 | 🟠 Med | Top nav has 8 top-level items + nested patient-education megamenu (8 sub-categories × multiple subitems). Cognitive overload. | Bounce on info-architecture |
| 6 | 🟠 Med | Service cards on home only highlight 4 of 16 services. Hub page is a flat list. | Discoverability |
| 7 | 🟠 Med | Typography: single weight, narrow scale, no rhythm. Body copy <16px on mobile. | Readability |
| 8 | 🟠 Med | Color palette: dated medical blue + grey gradient; no semantic system | Brand feels generic |
| 9 | 🟠 Med | Insurance list rendered as plain bullet text instead of trust-signal badge grid | Wasted trust real estate |
| 10 | 🟠 Med | Reviews shown via BirdEye iframe — slow, non-styled, off-brand | LCP/CLS hit |
| 11 | 🟡 Low | Footer is single line ("Copyright • Admin Log In • Site Map") — wastes opportunity for sitemap, NAP repetition, trust badges | SEO + trust |
| 12 | 🟡 Low | No breadcrumbs on inner pages | Orientation + SEO |
| 13 | 🟡 Low | Service pages average ~320 words with no FAQ, no process diagram, no related-services rail | Conversion + SEO depth |
| 14 | 🟡 Low | Gallery is unstructured, no before/after framing | Missed credibility |
| 15 | 🟡 Low | No accessibility pass: missing focus rings, low-contrast link colors, no skip-link | WCAG 2.2 AA gap |

### 2.2 What's Working (preserve)
- Local NAP consistency
- 80+ educational articles → strong topical authority (keep URLs intact)
- Real patient testimonials with names
- Comprehensive insurance list
- Clear hours / emergency line

---

## PHASE 3 — REDESIGN STRATEGY & DESIGN SYSTEM

### 3.1 Brand Direction: "Calm Clinical Premium"
Reference targets: Hims, One Medical, Tend (Tend Dental), Apple Health pages. Premium without sterile.

### 3.2 Design Tokens

```ts
// tokens.ts
export const tokens = {
  color: {
    // Surface
    bg:        '#FBFCFE',   // off-white
    surface:   '#FFFFFF',
    surfaceMuted: '#F2F6FB',
    // Brand — soft clinical blue
    brand50:   '#EAF3FB',
    brand100:  '#D2E5F4',
    brand200:  '#A6CBE8',
    brand400:  '#4F94C9',
    brand600:  '#1F6FAE',   // primary action
    brand700:  '#155483',
    // Accent — warm trust
    accent:    '#C9A36B',   // soft gold for awards / 5-star
    // Text
    ink900:    '#0E1A2B',
    ink700:    '#33445C',
    ink500:    '#6B7A90',
    ink300:    '#A9B4C2',
    // Semantic
    success:   '#1F8A5C',
    warning:   '#D58A12',
    danger:    '#C0392B',
  },
  radius: { sm: 6, md: 10, lg: 16, xl: 24, pill: 9999 },
  shadow: {
    sm:  '0 1px 2px rgba(14,26,43,.06)',
    md:  '0 6px 16px -4px rgba(14,26,43,.10)',
    lg:  '0 24px 48px -16px rgba(14,26,43,.18)',
  },
  font: {
    display: '"Fraunces", "Source Serif Pro", Georgia, serif',  // editorial trust
    sans:    '"Inter", system-ui, sans-serif',                  // body
  },
  // 1.25 modular scale, 16px base
  fontSize: {
    xs: '12px', sm: '14px', base: '16px', lg: '18px',
    xl: '20px', '2xl': '25px', '3xl': '31px', '4xl': '39px',
    '5xl': '49px', '6xl': '61px', '7xl': '76px',
  },
  space: { /* 4-pt grid: 4,8,12,16,20,24,32,40,48,64,80,96,128 */ },
  motion: {
    ease: {
      out:    [0.22, 1, 0.36, 1],     // cinematic out
      inOut:  [0.65, 0, 0.35, 1],
      spring: { type: 'spring', stiffness: 220, damping: 28 },
    },
    duration: { fast: 0.18, base: 0.32, slow: 0.6, hero: 0.9 },
  },
} as const;
```

### 3.3 Typography Rules
- Display H1: Fraunces 600, 49–76px, tracking -2%
- Section H2: Fraunces 500, 31–39px
- Body: Inter 400, 17px / 1.65 line-height
- Captions / eyebrows: Inter 600, 12px, tracking +8%, uppercase
- Mobile body **never <16px**.

### 3.4 Layout System
- 12-col grid, 1280px max-width, 24px gutter
- Section vertical rhythm: 96–128px desktop, 64–80px mobile
- Card radius standard: 16px; hero/feature: 24px

### 3.5 Page-by-Page Redesign Brief

**Homepage (preserve all H1/H2 copy)**
1. **Sticky transparent → solid header** with logo, slimmed nav (5 items max: Services, About, New Patients, Reviews, Contact + persistent "Book" CTA). Patient Education / Resources collapsed into a "More" mega-panel.
2. **Hero (single static, not carousel):** left = H1 "Friendly Staff. Beautiful Smiles. Welcoming Environment." + subhead + dual CTA (Book / Call). Right = warm patient-greeting photograph or 30-sec ambient loop video poster (lazy). Trust strip below: "20+ yrs in Aurora • 18 insurances accepted • Same-week emergency".
3. **Featured Services (H2 preserved):** 4-card responsive grid → expand to 8 with horizontal scroll on mobile. Each card: icon, name, 1-line outcome, "Learn more" link to existing slug.
4. **Dental Emergency (H2 preserved):** red-accented band w/ click-to-call.
5. **"We'll Provide You With That Winning Smile!" (H2):** about/welcome — split with Dr. Ammari portrait + signature.
6. **Appointment Request (H2):** redesigned form (see 6.4).
7. **Meet Our Staff (H2):** card carousel.
8. **Testimonials (H2):** keep BirdEye for SEO/aggregation but render styled inline pull-quotes; iframe lazy-loaded under fold.
9. **Featured Articles (H2):** 8-card grid linked into existing `/articles/*` URLs.
10. **Location & Hours (H2):** map + hours + insurance badge wall.
11. **Footer:** full sitemap, NAP repeated (LocalBusiness schema dup OK), HIPAA + non-discrimination links, social.

**Service pages (16) — same template, headings preserved**
- Hero strip: H1, eyebrow ("General Dentistry" etc.), short description, Book CTA, anchor nav
- Sections: Overview → Benefits (icon list) → Process (numbered timeline) → FAQ (accordion) → Related Services rail → CTA banner
- Right rail (desktop): sticky mini-card with Phone, Book, Hours
- Note: existing copy is short (~320w). **Do not rewrite copy** — re-flow it into the new template; expand only via FAQ schema additions if/when client supplies new content.

**Appointment page**
- 2-step progressive form (Step 1: name/phone/email/preferred-date; Step 2: insurance/reason/notes). Inline validation. HIPAA notice. Success state with confirmation animation.

**Contact / Location**
- Map on top, NAP card, directions CTA, parking note, transit note, after-hours line.

**Article pages**
- Long-form readable template: 72ch column, drop-cap H1, sticky TOC sidebar, reading-progress bar, related-article rail.

---

## PHASE 4 — ANIMATION SYSTEM (FRAMER MOTION)

### 4.1 Principles
1. **Motion has meaning** — every animation answers "did something change, where am I, what's actionable?"
2. **300ms is the ceiling** for UI feedback. Hero/scene transitions may go to 600–900ms.
3. **Easing:** custom cubic `[0.22, 1, 0.36, 1]` for entrances; spring `{ stiffness: 220, damping: 28 }` for interactive.
4. **Reduced motion:** respect `prefers-reduced-motion: reduce` — replace with opacity-only fades.
5. **Never animate layout** during scroll; only `transform` + `opacity`.

### 4.2 Motion Primitives (`/lib/motion.ts`)
```ts
import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,
            transition: { duration: 0.6, ease: [0.22,1,0.36,1] } },
};

export const stagger = (gap = 0.08): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: gap, delayChildren: 0.05 } },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show:   { opacity: 1, scale: 1,
            transition: { type: 'spring', stiffness: 220, damping: 28 } },
};

export const reveal = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.3 },
};
```

### 4.3 Scroll-Driven Hero
```tsx
// Hero.tsx
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ['start start', 'end start'],
});
const y    = useTransform(scrollYProgress, [0, 1], [0, 120]);
const blur = useTransform(scrollYProgress, [0, 1], [0, 6]);
const op   = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
const ySpring = useSpring(y, { stiffness: 80, damping: 20 });
```
- Background image translates Y at 60% scroll speed (parallax)
- Headline fades + slides at 80% scroll
- CTA pill keeps at 100% — never hides

### 4.4 Section Reveals
- Every section uses `motion.section` with `whileInView` + `stagger(0.08)`.
- Children: H2, copy, then card grid each with `fadeUp`.
- `viewport={{ once: true, amount: 0.3 }}` — fires once at 30% visible.

### 4.5 Micro-interactions
| Component | Idle | Hover | Active | Focus |
|-----------|------|-------|--------|-------|
| Primary button | shadow.md | y: -2, shadow.lg, 200ms | scale 0.98 | 2px brand400 ring |
| Service card | shadow.sm | y: -4, shadow.lg, scale 1.02, icon rotate 4° | — | ring brand200 |
| Nav link | underline 0% | underline 100% sweep L→R 220ms | — | bg brand50 |
| Input | border ink300 | border brand400 | border brand600 + label float | ring brand200 |
| Accordion | + icon | rotate 0→45° | open: content height auto + fadeUp | — |

### 4.6 Page Transitions
- Use Next.js `template.tsx` to wrap children in `AnimatePresence` with `mode="wait"`.
- Outgoing: opacity 1→0 + y 0→-12 over 220ms.
- Incoming: opacity 0→1 + y 12→0 over 320ms, delayed 100ms.

### 4.7 Cinematic Touches (used sparingly)
- **Tooth icon morph** in hero — subtle SVG path morph on first paint (one time, 1.2s).
- **Number counter** for "20+ years," "18 insurances," "5-star average" — counts up on first viewport intersect.
- **Magnetic CTA** — primary "Book Appointment" button gently follows cursor within 80px (desktop only).
- **Marquee** for insurance logos — pauses on hover, hidden from screen-reader.

### 4.8 Performance Guardrails
- All Framer Motion components use `LazyMotion` + `domAnimation` (or `domMax` only where needed) → ~60% smaller bundle.
- Code-split motion-heavy sections with `next/dynamic` and `ssr: false`.
- Run `will-change: transform` only during active animation, then strip.

---

## PHASE 5 — PERFORMANCE OPTIMIZATION

### 5.1 Targets (Core Web Vitals, 75th-percentile mobile)
- LCP ≤ 2.0s
- INP ≤ 150ms
- CLS ≤ 0.05
- TTFB ≤ 0.6s
- Lighthouse Mobile: Performance ≥ 95, Accessibility 100, SEO 100, Best Practices ≥ 95

### 5.2 Tactics
1. **Stack:** Next.js 16 App Router on Vercel (Fluid Compute, default 300s timeout, Turbopack).
2. **Images:** `next/image` everywhere, AVIF + WebP, explicit width/height to lock CLS, `priority` on hero only.
3. **Fonts:** `next/font/google` for Inter & Fraunces with `display: swap`, preload subset.
4. **Hero LCP:** static image, not video; ≤120KB AVIF, preload as image.
5. **Carousels removed** — single hero saves ~600KB JS + improves LCP.
6. **Iframes (BirdEye, Google Maps) lazy-loaded** below fold via `loading="lazy"` + IntersectionObserver placeholder.
7. **Code splitting:** route segments + dynamic imports for Testimonials, Map, Form-Step-2.
8. **Tailwind v4 / CSS-vars** — purge unused; ship < 12KB CSS gz.
9. **Edge caching:** static service pages → ISR `revalidate: 86400` with `cacheTag('services')` (Next.js 16 cache components / `use cache`).
10. **Analytics:** Vercel Analytics + Speed Insights; GA4 deferred via partytown if required.
11. **Prefetch:** nav links + key CTAs use `next/link` prefetch (default).
12. **Bundle budget:** initial JS ≤ 90KB gz on home. Enforce in CI.
13. **Animations off main thread** — use `transform`/`opacity` only; never animate `top`, `left`, `width`, `height`.
14. **Third-party audit:** drop jQuery, drop Officite scripts entirely (we own the rebuild).

---

## PHASE 6 — TECHNICAL IMPLEMENTATION

### 6.1 Tech Stack Decision
- **Framework:** Next.js 16 (App Router, Cache Components, PPR)
- **Language:** TypeScript strict
- **Styling:** Tailwind CSS v4 + CSS variables from tokens
- **Animation:** Framer Motion (LazyMotion)
- **Forms:** React Hook Form + Zod
- **Schema:** `next-seo` or hand-rolled JSON-LD components
- **Hosting:** Vercel
- **CMS for blog/articles:** Sanity or Contentlayer (or static MDX import of existing 80 articles to preserve URLs 1:1)
- **Booking:** integrate LocalMed / NexHealth / Dentrix Hub if available; otherwise enhance the form with Resend email + Twilio SMS confirmation
- **Analytics:** Vercel Analytics + Speed Insights + GA4 (server-side via Measurement Protocol where possible)

### 6.2 File Structure

```
ammari-dental/
├─ app/
│  ├─ (marketing)/
│  │  ├─ layout.tsx                  # marketing chrome
│  │  ├─ template.tsx                # page-transition AnimatePresence
│  │  ├─ page.tsx                    # /
│  │  ├─ appointment/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ new-patients/page.tsx
│  │  ├─ -new-patient-forms/page.tsx
│  │  ├─ our-dental-office-location/page.tsx
│  │  ├─ dental-staff/page.tsx
│  │  ├─ gallery/page.tsx
│  │  ├─ reviews/page.tsx
│  │  ├─ testimonials/page.tsx
│  │  ├─ financing/page.tsx
│  │  ├─ -improving-your-smile/page.tsx
│  │  ├─ -q---a/page.tsx
│  │  ├─ educational-videos/page.tsx
│  │  ├─ links/page.tsx
│  │  ├─ privacy/page.tsx
│  │  ├─ notice-of-non-discrimination/page.tsx
│  │  └─ services/                   # NOT a route segment — see below
│  │
│  ├─ dental-services/page.tsx       # hub
│  ├─ comfortable-dentistry/page.tsx
│  ├─ dental-emergencies/page.tsx
│  ├─ teeth-whitening/page.tsx
│  ├─ bonding/page.tsx
│  ├─ tooth-colored-fillings/page.tsx
│  ├─ dental-crowns/page.tsx
│  ├─ bridges/page.tsx
│  ├─ veneers/page.tsx
│  ├─ root-canal/page.tsx
│  ├─ deep-cleaning/page.tsx
│  ├─ preventative-periodontics/page.tsx
│  ├─ night-guards/page.tsx
│  ├─ dental-implants/page.tsx
│  ├─ implant-dentures/page.tsx
│  ├─ dentures/page.tsx
│  ├─ extractions/page.tsx
│  ├─ multiple-tooth-extractions/page.tsx
│  │
│  ├─ before-anesthesia/page.tsx
│  ├─ surgical-instructions/page.tsx
│  ├─ after-dental-implant-surgery/page.tsx
│  ├─ after-impacted-tooth/page.tsx
│  ├─ after-wisdom-tooth-removal/page.tsx
│  ├─ post-op-instructions/page.tsx
│  │
│  ├─ articles/[collection]/[slug]/page.tsx     # generates ~80×11 routes
│  ├─ api/appointment/route.ts                  # form handler → email + CRM
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ globals.css
│
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx                  # sticky, scroll-aware
│  │  ├─ MegaMenu.tsx
│  │  ├─ MobileNav.tsx
│  │  ├─ FloatingCallButton.tsx
│  │  ├─ Footer.tsx
│  │  └─ Breadcrumbs.tsx
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ TrustStrip.tsx
│  │  ├─ ServiceGrid.tsx
│  │  ├─ EmergencyBand.tsx
│  │  ├─ AboutSplit.tsx
│  │  ├─ AppointmentForm.tsx
│  │  ├─ StaffCarousel.tsx
│  │  ├─ TestimonialsWall.tsx
│  │  ├─ ArticlesGrid.tsx
│  │  ├─ LocationHours.tsx
│  │  ├─ InsuranceMarquee.tsx
│  │  ├─ FAQAccordion.tsx
│  │  ├─ ProcessTimeline.tsx
│  │  └─ RelatedServicesRail.tsx
│  ├─ ui/                            # primitive design system
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ Textarea.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Tag.tsx
│  │  ├─ Container.tsx
│  │  ├─ SectionHeader.tsx
│  │  ├─ AnimatedNumber.tsx
│  │  ├─ Marquee.tsx
│  │  └─ Reveal.tsx                  # wraps fadeUp variant
│  ├─ schema/
│  │  ├─ LocalBusinessSchema.tsx
│  │  ├─ DentistSchema.tsx
│  │  ├─ FAQPageSchema.tsx
│  │  ├─ MedicalProcedureSchema.tsx
│  │  └─ BreadcrumbSchema.tsx
│  └─ ServicePageTemplate.tsx        # one template, 16 service pages
│
├─ lib/
│  ├─ motion.ts                      # Framer variants + easings
│  ├─ tokens.ts                      # design tokens
│  ├─ seo.ts                         # title/meta helpers (preserve originals)
│  ├─ metadata.ts                    # per-route Metadata exports
│  ├─ services.ts                    # service catalog (name, slug, summary)
│  └─ analytics.ts
│
├─ content/
│  ├─ services/*.mdx                 # imported existing copy verbatim
│  ├─ articles/**/*.mdx              # 80×11 imported, URLs preserved
│  └─ staff.ts
│
├─ public/
│  ├─ images/ (AVIF/WebP)
│  └─ icons/
│
├─ tests/
│  ├─ playwright/
│  │  ├─ seo.spec.ts                 # asserts every old URL 200s w/ correct H1+title
│  │  ├─ a11y.spec.ts                # axe-core
│  │  └─ visual.spec.ts              # Percy / Chromatic
│  └─ unit/
│
├─ vercel.ts
├─ next.config.ts
├─ tailwind.config.ts
└─ tsconfig.json
```

### 6.3 Reusable Component Contracts (key examples)

```tsx
// components/ui/Button.tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
};

// components/sections/Hero.tsx
type HeroProps = {
  eyebrow?: string;
  headline: string;            // preserved H1
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
};

// components/ServicePageTemplate.tsx
type ServicePageProps = {
  slug: string;
  h1: string;                  // PRESERVED
  eyebrow: string;
  metaTitle: string;           // PRESERVED
  metaDescription: string;     // PRESERVED
  overviewMdx: ReactNode;      // existing copy verbatim
  benefits?: { icon: string; title: string; body: string }[];
  process?: { step: number; title: string; body: string }[];
  faq?: { q: string; a: string }[];   // additive only — empty unless client supplies
  related: string[];           // slugs
};
```

### 6.4 Appointment Form Architecture

```
AppointmentForm
├─ React Hook Form + Zod schema
├─ Step 1 — name, phone (US format), email, preferred date/time, contact pref
├─ Step 2 — insurance carrier (select 18 + Other), reason, notes, HIPAA acknowledgement
├─ Submit → POST /api/appointment
│           → Resend email to office + Twilio SMS to office
│           → confirmation email to patient
│           → returns 200 → animated success state (checkmark draw + confetti-lite)
└─ Error state inline; field-level only (no full-page error)
```
- WCAG: every input labeled, error linked via `aria-describedby`, focus moves on step change.
- Anti-spam: hCaptcha invisible; honeypot field.
- HIPAA notice text + link to /privacy.

### 6.5 SEO Preservation Layer
- One `lib/metadata.ts` exporting a `Metadata` object per route. Source of truth: the **current live `<title>` and `<meta description>` strings**, archived to JSON before launch.
- Each page exports `export const metadata = pageMeta['/dental-implants']`.
- All current H1/H2/H3 strings stored in `content/headings.ts` and rendered verbatim.
- Schema: `<LocalBusinessSchema>` in root layout + `<DentistSchema>`, plus `<FAQPageSchema>` & `<MedicalProcedureSchema>` on relevant service pages, `<BreadcrumbSchema>` on every interior page.
- `app/sitemap.ts` enumerates every URL from `lib/routes.ts` — diff against legacy sitemap in CI.

### 6.6 Migration Strategy
1. Crawl current site fully (Screaming Frog) → CSV: URL, title, meta, H1–H3, canonical, status.
2. Lock CSV as `legacy-seo-snapshot.json` in repo.
3. Build new site behind preview URL.
4. CI test: every legacy URL must resolve 200 with **identical title + H1**.
5. Cutover via DNS; keep 301s only for any URL legitimately retired.
6. Submit new sitemap to GSC; monitor coverage 30 days.

---

## PHASE 7 — QA CHECKLIST (40 items)

### Responsiveness
- [ ] 1. Renders correctly at 320 / 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920
- [ ] 2. No horizontal scroll at any breakpoint
- [ ] 3. Sticky header collapses to mobile nav < 1024px
- [ ] 4. Floating call button visible on all mobile pages, hidden on desktop
- [ ] 5. Forms usable single-handed on iPhone SE

### SEO Preservation
- [ ] 6. Every legacy URL returns 200
- [ ] 7. Every page `<title>` matches archived snapshot byte-for-byte
- [ ] 8. Every meta description preserved
- [ ] 9. Every H1 string preserved
- [ ] 10. H2/H3 hierarchy preserved (or deviation justified in comment)
- [ ] 11. Canonical URLs correct
- [ ] 12. `app/sitemap.ts` output matches legacy sitemap (set diff = ∅)
- [ ] 13. `robots.ts` allows crawl, sitemap referenced
- [ ] 14. JSON-LD validates in Google Rich Results Test (LocalBusiness, Dentist, FAQ, Breadcrumb)
- [ ] 15. Internal linking from home → all 16 services preserved
- [ ] 16. NAP consistent across header, footer, schema, contact page

### Accessibility (WCAG 2.2 AA)
- [ ] 17. axe-core passes (0 critical) on home + 3 service pages + appointment
- [ ] 18. All images have `alt`; decorative images `alt=""`
- [ ] 19. Color contrast ≥ 4.5:1 body, ≥ 3:1 large text
- [ ] 20. Keyboard navigable end-to-end; visible focus rings
- [ ] 21. Skip-to-content link
- [ ] 22. Form errors announced to screen readers
- [ ] 23. Reduced-motion respected (animations swap to opacity)

### Performance
- [ ] 24. Lighthouse mobile Perf ≥ 95 on home + 3 services
- [ ] 25. LCP ≤ 2.0s field data
- [ ] 26. CLS ≤ 0.05
- [ ] 27. INP ≤ 150ms
- [ ] 28. Initial JS ≤ 90KB gz on home
- [ ] 29. No iframes load above fold
- [ ] 30. Hero image preloaded; AVIF served

### Animation
- [ ] 31. No animation drops below 60fps on mid-tier mobile (Pixel 5)
- [ ] 32. No layout shift caused by animation (CLS unaffected)
- [ ] 33. Page transitions complete < 500ms
- [ ] 34. Hover/focus states present on every interactive element
- [ ] 35. Animations cease when tab backgrounded

### CTAs / Conversion
- [ ] 36. "Book Appointment" CTA visible above the fold on every page
- [ ] 37. Click-to-call works on mobile (`tel:` link)
- [ ] 38. Appointment form submits, sends email + SMS, shows success state
- [ ] 39. Form validation prevents bad data; HIPAA notice present
- [ ] 40. Insurance list and emergency line present in footer
- [ ] 41. 404 page has search + popular links + back-home CTA
- [ ] 42. Analytics events fire on CTA click and form submit

---

## IMPLEMENTATION ROADMAP (8 weeks)

| Week | Workstream | Deliverable |
|------|-----------|-------------|
| 1 | Discovery | Legacy SEO snapshot CSV, brand workshop, content lock |
| 2 | Design system | Tokens, typography, primitives in Storybook |
| 3 | Layout & motion | Header / Footer / Hero / Reveal primitives + page transitions |
| 4 | Homepage | Full home assembled, motion polished |
| 5 | Service template | One template, 16 routes generated, copy ported verbatim |
| 6 | Forms + integrations | Appointment form, Resend, Twilio, schema, BirdEye lazy embed |
| 7 | Articles + remaining pages | 80×11 article routes, surgical instructions, info pages |
| 8 | QA, perf, launch | All 42 QA items green, Vercel prod deploy, GSC resubmit |

---

## DELIVERY SUMMARY

This plan replaces a templated Officite site with a Next.js 16 + Framer Motion + Vercel build that:
- Preserves **every URL, slug, title, meta, H1/H2/H3, schema, and internal link**
- Replaces a 4-slide carousel hero (LCP killer) with a single-image cinematic hero + scroll-driven parallax
- Compresses an 8-item nav into 5 + a focused "Book" CTA, with a sticky header and mobile floating call
- Standardizes 16 service pages onto one premium template (overview → benefits → process → FAQ → related)
- Introduces a tokenized design system, Inter + Fraunces typography, soft clinical-blue palette, 4-pt spacing grid
- Layers a disciplined Framer Motion system (variants, scroll, springs, reduced-motion respect)
- Hits Lighthouse 95+ via `next/image`, font subsetting, no-iframes-above-fold, lazy BirdEye, ISR
- Ships a 42-point QA gate enforced in CI before cutover

The legacy-SEO snapshot + CI diff is the safety net — nothing the search engine cares about can change without an explicit, reviewed deviation.
