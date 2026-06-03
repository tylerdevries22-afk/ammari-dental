/**
 * Service-tile illustration scenes.
 *
 * Each scene is a self-contained SVG composition on a 200×200 design grid.
 *  - `data-draw`  → element's outline animates in via stroke-dash draw-in
 *  - `data-fill`  → element fades + scales in
 *  - `data-anim`  → element gets a continuous *signature* idle motion, giving
 *                   every scene a recognisable personality (see the behavior
 *                   vocabulary in AnimatedIllustration.tsx). `data-origin="x y"`
 *                   sets a rotation pivot in SVG units; `data-seq="n"` orders a
 *                   cascade. The wrapper orchestrates all timing.
 *
 * Palette matches the practice logo: an emerald→lime gradient (`url(#leafGrad)`)
 * for the main shapes, a deep-emerald outline, and lime/yellow leaf accents.
 * Gradients are defined once by <ServiceIconDefs> (rendered by ServiceGrid).
 */

const T = {
  leaf50:   "var(--color-leaf-50)",
  leaf100:  "var(--color-leaf-100)",
  leaf300:  "var(--color-leaf-300)",
  leaf500:  "var(--color-leaf-500)",
  leaf600:  "var(--color-leaf-600)",
  leaf700:  "var(--color-leaf-700)",
  lime:     "var(--color-leaf-lime)",
  yellow:   "var(--color-leaf-yellow)",
  surface:  "var(--color-surface)",
};

/** Emerald→lime gradient + lime→yellow leaf gradient, defined once per page. */
export function ServiceIconDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-leaf-300)" />
          <stop offset="55%" stopColor="var(--color-leaf-600)" />
          <stop offset="100%" stopColor="var(--color-leaf-700)" />
        </linearGradient>
        <linearGradient id="leafGradLime" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-leaf-yellow)" />
          <stop offset="60%" stopColor="var(--color-leaf-lime)" />
          <stop offset="100%" stopColor="var(--color-leaf-500)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const GRAD = "url(#leafGrad)";
const LIMEGRAD = "url(#leafGradLime)";

const stroke = (extra: Record<string, string | number> = {}) => ({
  fill: "none",
  stroke: T.leaf700,
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

/** Signature-motion marker. `origin` is an SVG-unit pivot; `seq` orders cascades. */
const anim = (kind: string, opts: { origin?: string; seq?: number } = {}) => ({
  "data-anim": kind,
  ...(opts.origin ? { "data-origin": opts.origin } : {}),
  ...(opts.seq !== undefined ? { "data-seq": String(opts.seq) } : {}),
});

/** Canonical molar silhouette, centered on x=100 (y 60→168). Reused everywhere. */
const TOOTH =
  "M100 60c-22 0-38 18-38 40 0 16 4 32 12 50 5 11 12 18 18 18 6 0 8-8 10-22 1-8 4-12 8-12s7 4 8 12c2 14 4 22 10 22 6 0 13-7 18-18 8-18 12-34 12-50 0-22-16-40-38-40-2 0-6 1-10 1-4 0-8-1-10-1z";

/** Symmetric four-point sparkle/star path centered on (cx,cy). */
const sparkle = (cx: number, cy: number, r: number, ri = r * 0.24) =>
  `M${cx} ${cy - r} L${cx + ri} ${cy - ri} L${cx + r} ${cy} L${cx + ri} ${cy + ri} L${cx} ${cy + r} L${cx - ri} ${cy + ri} L${cx - r} ${cy} L${cx - ri} ${cy - ri} Z`;

/** Heart path centered on (cx,cy), roughly 2s wide / 1.7s tall. */
const heart = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + s * 0.78} C ${cx - s * 1.15} ${cy - s * 0.05}, ${cx - s * 0.5} ${cy - s}, ${cx} ${cy - s * 0.32} C ${cx + s * 0.5} ${cy - s}, ${cx + s * 1.15} ${cy - s * 0.05}, ${cx} ${cy + s * 0.78} Z`;

const Bg = () => <rect {...fill(T.leaf50)} width="200" height="200" rx="20" />;

/* ─── General dentistry — the logo motif (tooth + swaying leaf sprout) ── */
export function GeneralScene() {
  return (
    <g>
      <Bg />
      {/* tooth, lowered to make room for the sprout above */}
      <g transform="translate(0 14)">
        <path {...fill(GRAD)} d={TOOTH} />
        <path {...stroke()} d={TOOTH} />
        <path {...fill(T.surface)} d={sparkle(86, 104, 9)} />
      </g>
      {/* leaf sprout — sways from the stem base (the practice mark) */}
      <g {...anim("sway", { origin: "100 86" })}>
        <path {...stroke({ strokeWidth: 4 })} d="M100 86 C 100 72 100 62 100 52" />
        {/* right leaf */}
        <path {...fill(LIMEGRAD)} d="M101 70 C 106 49 123 40 143 43 C 137 66 119 74 101 70 Z" />
        <path {...stroke()} d="M101 70 C 106 49 123 40 143 43 C 137 66 119 74 101 70 Z" />
        <path {...stroke({ strokeWidth: 2.2 })} d="M109 63 C 120 56 131 51 139 48" />
        {/* left leaf */}
        <path {...fill(T.lime)} d="M99 74 C 94 56 80 48 61 51 C 67 71 82 78 99 74 Z" />
        <path {...stroke()} d="M99 74 C 94 56 80 48 61 51 C 67 71 82 78 99 74 Z" />
        <path {...stroke({ strokeWidth: 2.2 })} d="M91 67 C 81 61 73 57 65 54" />
      </g>
    </g>
  );
}

/* ─── Teeth whitening — twinkling sparkles ──────────────────────────── */
export function WhiteningScene() {
  return (
    <g>
      <Bg />
      <path {...fill(GRAD)} d={TOOTH} />
      <path {...stroke()} d={TOOTH} />
      {/* shine on the tooth */}
      <path {...fill(T.surface)} {...anim("twinkle", { seq: 0 })} d={sparkle(86, 96, 9)} />
      {/* drifting sparkles */}
      <path {...fill(LIMEGRAD)} {...anim("twinkle", { seq: 1 })} d={sparkle(150, 46, 13)} />
      <path {...fill(T.lime)} {...anim("twinkle", { seq: 2 })} d={sparkle(42, 70, 9)} />
      <circle {...fill(T.leaf300)} {...anim("twinkle", { seq: 3 })} cx="166" cy="118" r="5" />
    </g>
  );
}

/* ─── Veneers — shells settle in a left-to-right cascade ─────────────── */
export function VeneersScene() {
  const cols = [50, 100, 150];
  return (
    <g>
      <Bg />
      {cols.map((cx, i) => (
        <g key={cx} {...anim("pulse", { seq: i })}>
          <rect {...fill(i === 1 ? GRAD : T.leaf100)} x={cx - 28} y="50" width="56" height="82" rx="22" />
          <rect {...stroke()} x={cx - 28} y="50" width="56" height="82" rx="22" />
          {i === 1 && <path {...fill(T.surface)} d={sparkle(cx, 78, 11)} />}
        </g>
      ))}
      <path {...stroke()} d="M40 150 L160 150" />
      <rect {...fill(T.lime)} x="40" y="147" width="120" height="6" rx="3" />
    </g>
  );
}

/* ─── Dental implants — the screw spins into place ──────────────────── */
export function ImplantScene() {
  return (
    <g>
      <Bg />
      {/* crown */}
      <path {...fill(GRAD)} d="M100 42c-19 0-32 15-32 33 0 12 4 22 8 29h48c4-7 8-17 8-29 0-18-13-33-32-33z" />
      <path {...stroke()} d="M100 42c-19 0-32 15-32 33 0 12 4 22 8 29h48c4-7 8-17 8-29 0-18-13-33-32-33z" />
      {/* abutment */}
      <rect {...fill(T.leaf300)} x="91" y="104" width="18" height="12" rx="2" />
      <path {...stroke()} d="M91 106h18M91 114h18" />
      {/* screw — spins around its own axis */}
      <g {...anim("spin", { origin: "100 150" })}>
        <path {...fill(GRAD)} d="M84 118h32v40a16 16 0 0 1-32 0z" opacity="0.5" />
        <path {...stroke()} d="M84 118h32v40a16 16 0 0 1-32 0z" />
        <g {...stroke({ strokeWidth: 2.4 })}>
          <path d="M86 126 L114 126" />
          <path d="M87 138 L113 138" />
          <path d="M90 150 L110 150" />
          <path d="M94 162 L106 162" />
        </g>
      </g>
      {/* shine */}
      <path {...fill(T.yellow)} {...anim("twinkle")} d={sparkle(126, 62, 9)} />
    </g>
  );
}

/* ─── Crowns + bridges — the gem pulses ─────────────────────────────── */
export function CrownScene() {
  return (
    <g>
      <Bg />
      <path {...fill(GRAD)} d="M38 92 L60 58 L80 92 L100 50 L120 92 L140 58 L162 92 L162 140 L38 140 Z" />
      <path {...stroke()} d="M38 92 L60 58 L80 92 L100 50 L120 92 L140 58 L162 92 L162 140 L38 140 Z" />
      <rect {...fill(T.leaf600)} x="38" y="140" width="124" height="16" rx="2" />
      <path {...stroke()} d="M38 156 L162 156" />
      {/* gem */}
      <g {...anim("pulse", { origin: "100 116" })}>
        <circle {...fill(T.yellow)} cx="100" cy="116" r="10" />
        <circle {...stroke()} cx="100" cy="116" r="10" />
      </g>
    </g>
  );
}

/* ─── Root canal — a treatment "ping" pulses from the apex ──────────── */
export function RootCanalScene() {
  const tooth =
    "M100 42c-22 0-38 18-38 40 0 8 2 16 4 22l13 76c2 9 15 9 17 0l4-28c1-6 4-9 0-9s-1 3 0 9l4 28c2 9 15 9 17 0l13-76c2-6 4-14 4-22 0-22-16-40-38-40z";
  return (
    <g>
      <Bg />
      <path {...fill(GRAD)} d={tooth} />
      <path {...stroke()} d="M100 42c-22 0-38 18-38 40 0 8 2 16 4 22" />
      <path {...stroke()} d="M134 104c2-6 4-14 4-22 0-22-16-40-38-40" />
      {/* canals */}
      <path {...stroke()} d="M78 104 L86 178" />
      <path {...stroke()} d="M100 106 L100 182" />
      <path {...stroke()} d="M122 104 L114 178" />
      {/* expanding ping ring + treated point */}
      <circle {...anim("ping")} cx="100" cy="132" r="14" fill="none" stroke={T.lime} strokeWidth="3" />
      <circle {...fill(T.yellow)} cx="100" cy="132" r="9" />
      <path {...stroke({ stroke: T.leaf700 })} d="M100 124 L100 140 M92 132 L108 132" />
    </g>
  );
}

/* ─── Cleaning / preventative — the brush scrubs, bubbles float ─────── */
export function CleaningScene() {
  return (
    <g>
      <Bg />
      {/* tooth, set left of centre */}
      <g transform="translate(-18 6)">
        <path {...fill(GRAD)} d={TOOTH} transform="scale(0.92)" />
        <path {...stroke()} d={TOOTH} transform="scale(0.92)" />
      </g>
      {/* toothbrush — oscillates around its head near the tooth */}
      <g {...anim("brush", { origin: "120 118" })}>
        <g transform="rotate(40 120 118)">
          <rect {...fill(T.leaf600)} x="120" y="111" width="52" height="13" rx="6.5" />
          <rect {...stroke()} x="120" y="111" width="52" height="13" rx="6.5" />
          <g {...stroke({ strokeWidth: 2.4 })}>
            <path d="M118 111 L114 104" />
            <path d="M124 111 L120 102" />
            <path d="M130 111 L126 102" />
            <path d="M136 111 L132 103" />
          </g>
        </g>
      </g>
      {/* bubbles drift up */}
      <circle {...fill(T.leaf300)} {...anim("float", { seq: 0 })} cx="48" cy="120" r="9" />
      <circle {...fill(T.lime)} {...anim("float", { seq: 1 })} cx="66" cy="148" r="6" />
      <circle {...fill(T.leaf300)} {...anim("float", { seq: 2 })} cx="54" cy="166" r="4" />
    </g>
  );
}

/* ─── Emergency care — the shield beats like a pulse ────────────────── */
export function EmergencyScene() {
  return (
    <g>
      <Bg />
      <g {...anim("heartbeat", { origin: "100 100" })}>
        <path {...fill(GRAD)} d="M100 34 L152 55 L152 110 C152 141 130 160 100 170 C70 160 48 141 48 110 L48 55 Z" />
        <path {...stroke()} d="M100 34 L152 55 L152 110 C152 141 130 160 100 170 C70 160 48 141 48 110 L48 55 Z" />
        <path {...fill(T.surface)} d="M89 67 h22 v22 h22 v22 h-22 v22 h-22 v-22 h-22 v-22 h22 z" />
        <path {...stroke({ strokeWidth: 2.6 })} d="M89 67 h22 v22 h22 v22 h-22 v22 h-22 v-22 h-22 v-22 h22 z" />
      </g>
    </g>
  );
}

/* ─── Dentures — teeth pop in, left to right ────────────────────────── */
export function DenturesScene() {
  const teeth = [
    { x: 56, y: 60, h: 32 },
    { x: 72, y: 56, h: 36 },
    { x: 88, y: 54, h: 38 },
    { x: 104, y: 54, h: 38 },
    { x: 120, y: 56, h: 36 },
    { x: 136, y: 60, h: 32 },
  ];
  return (
    <g>
      <Bg />
      {/* gum */}
      <path
        {...fill(GRAD)}
        d="M40 92 C40 132 70 152 100 152 C130 152 160 132 160 92 L150 92 L140 112 L130 92 L120 112 L110 92 L100 112 L90 92 L80 112 L70 92 L60 112 L50 92 Z"
      />
      <path
        {...stroke()}
        d="M40 92 C40 132 70 152 100 152 C130 152 160 132 160 92 L150 92 L140 112 L130 92 L120 112 L110 92 L100 112 L90 92 L80 112 L70 92 L60 112 L50 92 Z"
      />
      {/* individual teeth cascade in */}
      {teeth.map((t, i) => (
        <g key={t.x} {...anim("pulse", { seq: i })}>
          <rect {...fill(T.surface)} x={t.x} y={t.y} width="14" height={t.h} rx="5" />
          <rect {...stroke({ strokeWidth: 2.4 })} x={t.x} y={t.y} width="14" height={t.h} rx="5" />
        </g>
      ))}
    </g>
  );
}

/* ─── Default fallback — the tooth gently bobs ──────────────────────── */
export function DefaultScene() {
  return (
    <g>
      <Bg />
      <circle {...fill(T.leaf100)} cx="100" cy="100" r="54" />
      <g {...anim("bob")}>
        <path {...fill(GRAD)} d={TOOTH} />
        <path {...stroke()} d={TOOTH} />
        <path {...fill(T.surface)} d={sparkle(86, 96, 8)} />
      </g>
    </g>
  );
}

/* ─── Comfortable dentistry — a heartbeat inside the tooth ──────────── */
export function ComfortableScene() {
  return (
    <g>
      <Bg />
      <path {...fill(GRAD)} d={TOOTH} />
      <path {...stroke()} d={TOOTH} />
      <g {...anim("heartbeat", { origin: "100 104" })}>
        <path {...fill(LIMEGRAD)} d={heart(100, 102, 22)} />
        <path {...stroke()} d={heart(100, 102, 22)} />
      </g>
    </g>
  );
}

/* ─── Tooth-colored fillings — a seamless filled cavity that glints ── */
export function FillingScene() {
  return (
    <g>
      <Bg />
      <path {...fill(T.leaf100)} d={TOOTH} />
      <path {...stroke()} d={TOOTH} />
      {/* the filling */}
      <path
        {...fill(GRAD)}
        d="M84 94 C84 84 93 79 100 79 C108 79 117 86 117 96 C117 107 107 112 99 112 C90 112 84 103 84 94 Z"
      />
      <path
        {...stroke({ strokeWidth: 2.4 })}
        d="M84 94 C84 84 93 79 100 79 C108 79 117 86 117 96 C117 107 107 112 99 112 C90 112 84 103 84 94 Z"
      />
      <path {...fill(T.surface)} {...anim("twinkle")} d={sparkle(96, 92, 8)} />
    </g>
  );
}

/* ─── Bonding — a resin layer sculpted onto the front of the tooth ──── */
export function BondingScene() {
  return (
    <g>
      <Bg />
      <path {...fill(T.leaf100)} d={TOOTH} />
      {/* bonded layer with a centre seam */}
      <path
        {...fill(GRAD)}
        d="M80 96 C82 78 94 70 100 70 C106 70 118 78 120 96 C120 118 108 134 100 134 C92 134 80 118 80 96 Z"
        opacity="0.92"
      />
      <path {...stroke()} d={TOOTH} />
      <path {...stroke({ strokeWidth: 2 })} d="M100 70 C103 90 103 114 100 134" />
      <path {...fill(T.yellow)} {...anim("twinkle", { seq: 0 })} d={sparkle(124, 62, 12)} />
      <path {...fill(T.lime)} {...anim("twinkle", { seq: 1 })} d={sparkle(66, 104, 7)} />
    </g>
  );
}

/* ─── Bridges — three crowns hang from a connecting rail (cascade) ──── */
export function BridgeScene() {
  const crowns = [
    { x: 50, g: GRAD, seq: 0 },
    { x: 90, g: LIMEGRAD, seq: 1 },
    { x: 130, g: GRAD, seq: 2 },
  ];
  return (
    <g>
      <Bg />
      <rect {...fill(T.leaf600)} x="38" y="72" width="124" height="20" rx="6" />
      <rect {...stroke()} x="38" y="72" width="124" height="20" rx="6" />
      {crowns.map(({ x, g, seq }) => (
        <g key={x} {...anim("pulse", { seq })}>
          <path {...fill(g)} d={`M${x} 92 h22 v32 a11 11 0 0 1 -22 0 z`} />
          <path {...stroke()} d={`M${x} 92 h22 v32 a11 11 0 0 1 -22 0 z`} />
        </g>
      ))}
    </g>
  );
}

/* ─── Deep cleaning / perio — a scaler works the gum line ───────────── */
export function DeepCleaningScene() {
  return (
    <g>
      <Bg />
      <g transform="translate(-14 4)">
        <path {...fill(GRAD)} d={TOOTH} transform="scale(0.9)" />
        <path {...stroke()} d={TOOTH} transform="scale(0.9)" />
      </g>
      {/* gum line */}
      <path {...stroke({ strokeWidth: 4 })} d="M30 132 C70 122 110 122 150 132" />
      <path {...fill(T.lime)} d="M30 132 C70 122 110 122 150 132 L150 140 C110 130 70 130 30 140 Z" opacity="0.6" />
      {/* scaler — scrubs at the gum line */}
      <g {...anim("brush", { origin: "112 126" })}>
        <g transform="rotate(34 112 126)">
          <rect {...fill(T.leaf600)} x="112" y="60" width="9" height="62" rx="4.5" />
          <rect {...stroke()} x="112" y="60" width="9" height="62" rx="4.5" />
          <path {...stroke()} d="M116 122 c0 6 -4 9 -9 9" />
        </g>
      </g>
      {/* loosened specks drift up */}
      <circle {...fill(T.leaf300)} {...anim("float", { seq: 0 })} cx="56" cy="150" r="5" />
      <circle {...fill(T.lime)} {...anim("float", { seq: 1 })} cx="72" cy="164" r="3.5" />
    </g>
  );
}

/* ─── Night guards — a clear guard arch under a crescent moon ────────── */
export function NightGuardScene() {
  return (
    <g>
      <Bg />
      {/* crescent moon */}
      <path {...fill(T.leaf300)} {...anim("twinkle", { seq: 0 })} d="M150 44 a22 22 0 1 0 18 34 a17 17 0 1 1 -18 -34 z" />
      <path {...fill(T.yellow)} {...anim("twinkle", { seq: 1 })} d={sparkle(58, 56, 9)} />
      {/* teeth arch */}
      <g transform="translate(0 6)">
        {[64, 84, 100, 116, 136].map((x, i) => (
          <rect key={x} {...fill(T.surface)} x={x - 8} y={108 - (i === 2 ? 6 : i === 1 || i === 3 ? 3 : 0)} width="16" height={34 + (i === 2 ? 6 : 0)} rx="5" />
        ))}
        {[64, 84, 100, 116, 136].map((x, i) => (
          <rect key={`s${x}`} {...stroke({ strokeWidth: 2 })} x={x - 8} y={108 - (i === 2 ? 6 : i === 1 || i === 3 ? 3 : 0)} width="16" height={34 + (i === 2 ? 6 : 0)} rx="5" />
        ))}
      </g>
      {/* clear guard hugging the arch */}
      <path {...fill(GRAD)} {...anim("float")} d="M48 132 C48 162 76 176 100 176 C124 176 152 162 152 132 C152 124 144 120 136 124 C120 132 80 132 64 124 C56 120 48 124 48 132 Z" opacity="0.45" />
      <path {...stroke()} d="M48 132 C48 162 76 176 100 176 C124 176 152 162 152 132" />
    </g>
  );
}

/* ─── Extractions — forceps lift a tooth free ───────────────────────── */
export function ExtractionScene() {
  return (
    <g>
      <Bg />
      {/* gum / socket */}
      <path {...fill(T.lime)} d="M40 150 h120 v8 a6 6 0 0 1 -6 6 H46 a6 6 0 0 1 -6 -6 z" opacity="0.6" />
      <path {...stroke()} d="M40 150 h120" />
      {/* the lifted tooth */}
      <g {...anim("bob")} transform="translate(0 4)">
        <path {...fill(GRAD)} d={TOOTH} transform="translate(28 26) scale(0.62)" />
        <path {...stroke()} d={TOOTH} transform="translate(28 26) scale(0.62)" />
      </g>
      {/* forceps gripping from above */}
      <g {...stroke({ strokeWidth: 4 })}>
        <path d="M78 36 L92 96" />
        <path d="M122 36 L108 96" />
        <path d="M92 96 q8 8 16 0" />
      </g>
      <circle {...fill(T.yellow)} {...anim("twinkle")} cx="100" cy="30" r="4" />
    </g>
  );
}

/* ─── Multiple extractions — a row of teeth, one drawn out (cascade) ── */
export function MultiExtractionScene() {
  const xs = [60, 100, 140];
  return (
    <g>
      <Bg />
      <path {...fill(T.lime)} d="M30 150 h140 v8 a6 6 0 0 1 -6 6 H36 a6 6 0 0 1 -6 -6 z" opacity="0.6" />
      <path {...stroke()} d="M30 150 h140" />
      {xs.map((x, i) => (
        <g key={x} {...anim("pulse", { seq: i })} transform={`translate(${x - 100} ${i === 1 ? -10 : 6})`}>
          <path {...fill(i === 1 ? LIMEGRAD : GRAD)} d={TOOTH} transform="translate(64 70) scale(0.34)" />
          <path {...stroke({ strokeWidth: 2.4 })} d={TOOTH} transform="translate(64 70) scale(0.34)" />
        </g>
      ))}
      {/* forceps over the centre tooth */}
      <g {...stroke({ strokeWidth: 3 })}>
        <path d="M86 40 L96 78" />
        <path d="M114 40 L104 78" />
        <path d="M96 78 q4 6 8 0" />
      </g>
    </g>
  );
}

/* ─── Implant dentures — an arch seated on two implant posts ─────────── */
export function ImplantDentureScene() {
  return (
    <g>
      <Bg />
      {/* two implant posts */}
      {[72, 128].map((x, i) => (
        <g key={x} {...anim("pulse", { seq: i })}>
          <rect {...fill(T.leaf300)} x={x - 7} y="120" width="14" height="46" rx="3" />
          <g {...stroke({ strokeWidth: 2.4 })}>
            <path d={`M${x - 9} 130 h18`} />
            <path d={`M${x - 9} 142 h18`} />
            <path d={`M${x - 9} 154 h18`} />
          </g>
        </g>
      ))}
      {/* denture arch seated on top */}
      <g {...anim("bob")}>
        <path {...fill(GRAD)} d="M40 96 C40 70 70 56 100 56 C130 56 160 70 160 96 C160 112 148 120 132 118 L132 104 L120 116 L108 104 L100 116 L92 104 L80 116 L68 104 L68 118 C52 120 40 112 40 96 Z" />
        <path {...stroke()} d="M40 96 C40 70 70 56 100 56 C130 56 160 70 160 96 C160 112 148 120 132 118 L132 104 L120 116 L108 104 L100 116 L92 104 L80 116 L68 104 L68 118 C52 120 40 112 40 96 Z" />
        <g {...fill(T.surface)}>
          {[64, 82, 100, 118, 136].map((x) => (
            <rect key={x} x={x - 6} y="68" width="12" height="26" rx="4" />
          ))}
        </g>
      </g>
    </g>
  );
}

/* ─── Scene registry — slug → JSX element factory ──────────────────── */
const registry: Record<string, () => React.ReactElement> = {
  "dental-services": GeneralScene,
  "comfortable-dentistry": ComfortableScene,
  "deep-cleaning": DeepCleaningScene,
  "preventative-periodontics": CleaningScene,
  "night-guards": NightGuardScene,
  "teeth-whitening": WhiteningScene,
  "bonding": BondingScene,
  "veneers": VeneersScene,
  "tooth-colored-fillings": FillingScene,
  "dental-crowns": CrownScene,
  "bridges": BridgeScene,
  "root-canal": RootCanalScene,
  "dentures": DenturesScene,
  "dental-implants": ImplantScene,
  "implant-dentures": ImplantDentureScene,
  "extractions": ExtractionScene,
  "multiple-tooth-extractions": MultiExtractionScene,
  "dental-emergencies": EmergencyScene,
};

/**
 * Render the illustration scene matching a service slug. Returns a JSX element
 * directly rather than a component constructor — avoids the
 * react-hooks/static-components lint warning that fires when components are
 * looked up at render time.
 */
export function renderSceneFor(slug: string): React.ReactElement {
  const Scene = registry[slug] ?? DefaultScene;
  return <Scene />;
}
