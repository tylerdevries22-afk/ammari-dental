/**
 * Service-tile illustration scenes.
 *
 * Each scene is a self-contained SVG composition. Children are tagged with
 * `data-draw` (animated via stroke draw-in) or `data-fill` (faded-in shape).
 * The parent <AnimatedIllustration> orchestrates the timing on scroll.
 *
 * All colors reference tokens via `var(--color-*)` so they re-skin with the
 * design system.
 */

const T = {
  brand50:  "var(--color-brand-50)",
  brand100: "var(--color-brand-100)",
  brand300: "var(--color-brand-300)",
  brand500: "var(--color-brand-500)",
  brand600: "var(--color-brand-600)",
  brand700: "var(--color-brand-700)",
  accent:   "var(--color-accent)",
  accent300:"var(--color-accent-300)",
  sage300:  "var(--color-sage-300)",
  ink200:   "var(--color-ink-200)",
  surface:  "var(--color-surface)",
};

const stroke = (extra: Record<string, string | number> = {}) => ({
  fill: "none",
  stroke: T.brand700,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "data-draw": "1",
  ...extra,
});

const fill = (color: string) => ({
  fill: color,
  "data-fill": "1",
});

/* ─── Teeth whitening ──────────────────────────────────────────────── */
export function WhiteningScene() {
  return (
    <g>
      {/* background tint */}
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* sparkles */}
      <path {...fill(T.accent)} d="M148 40 L150 50 L160 52 L150 54 L148 64 L146 54 L136 52 L146 50 Z" />
      <path {...fill(T.accent300)} d="M40 60 L42 68 L50 70 L42 72 L40 80 L38 72 L30 70 L38 68 Z" />
      <circle {...fill(T.brand300)} cx="172" cy="80" r="4" />
      {/* large tooth */}
      <path {...fill(T.surface)} d="M100 60c-22 0-38 18-38 40 0 16 4 32 12 50 5 11 12 18 18 18 6 0 8-8 10-22 1-8 4-12 8-12s7 4 8 12c2 14 4 22 10 22 6 0 13-7 18-18 8-18 12-34 12-50 0-22-16-40-38-40-2 0-6 1-10 1-4 0-8-1-10-1z" />
      <path {...stroke()} d="M100 60c-22 0-38 18-38 40 0 16 4 32 12 50 5 11 12 18 18 18 6 0 8-8 10-22 1-8 4-12 8-12s7 4 8 12c2 14 4 22 10 22 6 0 13-7 18-18 8-18 12-34 12-50 0-22-16-40-38-40-2 0-6 1-10 1-4 0-8-1-10-1z" />
      {/* sparkle on tooth */}
      <path {...fill(T.accent)} d="M88 90 L90 96 L96 98 L90 100 L88 106 L86 100 L80 98 L86 96 Z" />
    </g>
  );
}

/* ─── Veneers ──────────────────────────────────────────────────────── */
export function VeneersScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* row of three veneer tiles */}
      {[40, 100, 160].map((cx, i) => (
        <g key={cx} transform={`translate(${cx - 28} 50)`}>
          <rect
            {...fill(i === 1 ? T.surface : T.brand100)}
            x="0" y="0" width="56" height="80" rx="20"
          />
          <rect {...stroke()} x="0" y="0" width="56" height="80" rx="20" />
          {i === 1 && (
            <path {...fill(T.accent)} d="M28 22 L31 32 L41 34 L31 36 L28 46 L25 36 L15 34 L25 32 Z" />
          )}
        </g>
      ))}
      {/* underline */}
      <rect {...fill(T.brand300)} x="40" y="148" width="120" height="6" rx="3" />
      <path {...stroke()} d="M40 148 L160 148" />
    </g>
  );
}

/* ─── Dental implants ──────────────────────────────────────────────── */
export function ImplantScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* tooth crown */}
      <path {...fill(T.surface)} d="M100 40c-18 0-30 14-30 32 0 12 4 22 8 30h44c4-8 8-18 8-30 0-18-12-32-30-32z" />
      <path {...stroke()} d="M100 40c-18 0-30 14-30 32 0 12 4 22 8 30h44c4-8 8-18 8-30 0-18-12-32-30-32z" />
      {/* abutment */}
      <rect {...fill(T.brand300)} x="92" y="100" width="16" height="14" rx="2" />
      <path {...stroke()} d="M92 102h16M92 112h16" />
      {/* screw threads */}
      <g {...stroke()}>
        <path d="M86 118 L114 118" />
        <path d="M88 130 L112 130" />
        <path d="M90 142 L110 142" />
        <path d="M92 154 L108 154" />
      </g>
      <path {...fill(T.brand500)} d="M86 116h28v44a14 14 0 0 1-14 14 14 14 0 0 1-14-14V116z" opacity="0.4" />
      <path {...stroke()} d="M86 116h28v44a14 14 0 0 1-14 14 14 14 0 0 1-14-14V116z" />
      {/* shine */}
      <path {...fill(T.accent)} d="M124 60 L126 68 L134 70 L126 72 L124 80 L122 72 L114 70 L122 68 Z" />
    </g>
  );
}

/* ─── Crowns + Bridges ─────────────────────────────────────────────── */
export function CrownScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* crown shape (royal-style) */}
      <path
        {...fill(T.accent300)}
        d="M40 90 L60 60 L80 90 L100 50 L120 90 L140 60 L160 90 L160 140 L40 140 Z"
      />
      <path
        {...stroke()}
        d="M40 90 L60 60 L80 90 L100 50 L120 90 L140 60 L160 90 L160 140 L40 140 Z"
      />
      {/* base band */}
      <rect {...fill(T.accent)} x="40" y="140" width="120" height="14" />
      <path {...stroke()} d="M40 154 L160 154" />
      {/* gem */}
      <circle {...fill(T.brand500)} cx="100" cy="115" r="9" />
      <circle {...stroke()} cx="100" cy="115" r="9" />
    </g>
  );
}

/* ─── Root canal ──────────────────────────────────────────────────── */
export function RootCanalScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* tooth outline with roots */}
      <path
        {...fill(T.surface)}
        d="M100 40c-22 0-38 18-38 40 0 8 2 16 4 22l14 80c2 8 14 8 16 0l4-30c1-6 4-10 0-10s-1 4 0 10l4 30c2 8 14 8 16 0l14-80c2-6 4-14 4-22 0-22-16-40-38-40z"
      />
      <path {...stroke()} d="M100 40c-22 0-38 18-38 40 0 8 2 16 4 22" />
      <path {...stroke()} d="M134 102c2-6 4-14 4-22 0-22-16-40-38-40" />
      {/* roots */}
      <path {...stroke()} d="M70 100 L80 180" />
      <path {...stroke()} d="M100 102 L100 184" />
      <path {...stroke()} d="M130 100 L120 180" />
      {/* infection point */}
      <circle {...fill(T.accent)} cx="100" cy="135" r="10" />
      <path {...stroke({ stroke: T.accent })} d="M100 125 L100 145 M90 135 L110 135" />
    </g>
  );
}

/* ─── Cleanings / preventative ─────────────────────────────────────── */
export function CleaningScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* tooth */}
      <path
        {...fill(T.surface)}
        d="M120 70c-16 0-28 14-28 32 0 14 4 28 10 44 3 8 10 12 14 12s5-6 6-14c1-6 3-8 6-8s5 2 6 8c1 8 2 14 6 14s11-4 14-12c6-16 10-30 10-44 0-18-12-32-28-32-2 0-3 0-5 1-2-1-3-1-5-1z"
        transform="translate(-15 0)"
      />
      <path
        {...stroke()}
        d="M120 70c-16 0-28 14-28 32 0 14 4 28 10 44 3 8 10 12 14 12s5-6 6-14c1-6 3-8 6-8s5 2 6 8c1 8 2 14 6 14s11-4 14-12c6-16 10-30 10-44 0-18-12-32-28-32-2 0-3 0-5 1-2-1-3-1-5-1z"
        transform="translate(-15 0)"
      />
      {/* toothbrush handle */}
      <rect {...fill(T.brand500)} x="120" y="50" width="50" height="10" rx="5" transform="rotate(35 145 55)" />
      <rect {...stroke()} x="120" y="50" width="50" height="10" rx="5" transform="rotate(35 145 55)" />
      {/* bristles */}
      <g {...stroke()} transform="rotate(35 145 55)">
        <path d="M115 50 L113 44" />
        <path d="M119 50 L117 42" />
        <path d="M123 50 L121 42" />
        <path d="M127 50 L125 42" />
        <path d="M131 50 L129 42" />
      </g>
      {/* bubbles */}
      <circle {...fill(T.brand300)} cx="50" cy="120" r="8" />
      <circle {...fill(T.brand300)} cx="68" cy="146" r="6" />
      <circle {...fill(T.brand300)} cx="58" cy="160" r="4" />
    </g>
  );
}

/* ─── Emergency care ──────────────────────────────────────────────── */
export function EmergencyScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* shield */}
      <path
        {...fill(T.accent300)}
        d="M100 35 L150 55 L150 110 C150 140 130 158 100 168 C70 158 50 140 50 110 L50 55 Z"
      />
      <path
        {...stroke()}
        d="M100 35 L150 55 L150 110 C150 140 130 158 100 168 C70 158 50 140 50 110 L50 55 Z"
      />
      {/* cross */}
      <rect {...fill(T.surface)} x="88" y="68" width="24" height="60" rx="4" />
      <rect {...fill(T.surface)} x="70" y="86" width="60" height="24" rx="4" />
      <path {...stroke()} d="M88 68h24v60H88zM70 86h60v24H70z" />
    </g>
  );
}

/* ─── Dentures ────────────────────────────────────────────────────── */
export function DenturesScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      {/* upper denture (smile shape) */}
      <path
        {...fill(T.accent)}
        d="M40 90 C40 130 70 150 100 150 C130 150 160 130 160 90 L150 90 L140 110 L130 90 L120 110 L110 90 L100 110 L90 90 L80 110 L70 90 L60 110 L50 90 Z"
      />
      <path
        {...stroke()}
        d="M40 90 C40 130 70 150 100 150 C130 150 160 130 160 90 L150 90 L140 110 L130 90 L120 110 L110 90 L100 110 L90 90 L80 110 L70 90 L60 110 L50 90 Z"
      />
      {/* upper individual teeth */}
      <g {...fill(T.surface)}>
        <rect x="56" y="60" width="14" height="32" rx="4" />
        <rect x="72" y="56" width="14" height="36" rx="4" />
        <rect x="88" y="54" width="14" height="38" rx="4" />
        <rect x="104" y="54" width="14" height="38" rx="4" />
        <rect x="120" y="56" width="14" height="36" rx="4" />
        <rect x="136" y="60" width="14" height="32" rx="4" />
      </g>
      <g {...stroke()}>
        <rect x="56" y="60" width="14" height="32" rx="4" />
        <rect x="72" y="56" width="14" height="36" rx="4" />
        <rect x="88" y="54" width="14" height="38" rx="4" />
        <rect x="104" y="54" width="14" height="38" rx="4" />
        <rect x="120" y="56" width="14" height="36" rx="4" />
        <rect x="136" y="60" width="14" height="32" rx="4" />
      </g>
    </g>
  );
}

/* ─── Default fallback ─────────────────────────────────────────────── */
export function DefaultScene() {
  return (
    <g>
      <rect {...fill(T.brand50)} width="200" height="200" rx="20" />
      <circle {...fill(T.brand100)} cx="100" cy="100" r="50" />
      <path
        {...fill(T.surface)}
        d="M100 70c-15 0-26 12-26 26 0 11 3 22 8 32 3 6 8 8 10 8 3 0 4-5 5-12 1-5 2-7 5-7s4 2 5 7c1 7 2 12 5 12 2 0 7-2 10-8 5-10 8-21 8-32 0-14-12-26-26-26z"
      />
      <path
        {...stroke()}
        d="M100 70c-15 0-26 12-26 26 0 11 3 22 8 32 3 6 8 8 10 8 3 0 4-5 5-12 1-5 2-7 5-7s4 2 5 7c1 7 2 12 5 12 2 0 7-2 10-8 5-10 8-21 8-32 0-14-12-26-26-26z"
      />
    </g>
  );
}

/* ─── Scene registry — slug → JSX element factory ──────────────────── */
const registry: Record<string, () => React.ReactElement> = {
  "teeth-whitening": WhiteningScene,
  "veneers": VeneersScene,
  "dental-implants": ImplantScene,
  "implant-dentures": ImplantScene,
  "dental-crowns": CrownScene,
  "bridges": CrownScene,
  "root-canal": RootCanalScene,
  "preventative-periodontics": CleaningScene,
  "deep-cleaning": CleaningScene,
  "comfortable-dentistry": CleaningScene,
  "dental-emergencies": EmergencyScene,
  "extractions": EmergencyScene,
  "multiple-tooth-extractions": EmergencyScene,
  "dentures": DenturesScene,
  "tooth-colored-fillings": WhiteningScene,
  "bonding": VeneersScene,
  "night-guards": CleaningScene,
};

/**
 * Render the illustration scene matching a service slug. Returns a JSX
 * element directly rather than a component constructor — this avoids the
 * react-hooks/static-components lint warning that fires when components
 * are looked up at render time.
 */
export function renderSceneFor(slug: string): React.ReactElement {
  const Scene = registry[slug] ?? DefaultScene;
  return <Scene />;
}
