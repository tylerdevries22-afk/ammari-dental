/**
 * Email template color tokens.
 *
 * Email clients (especially Outlook, Gmail mobile) don't reliably support CSS
 * custom properties or external stylesheets, so we must inline hex values.
 * This file is the single source of truth — keep aligned with the brand
 * tokens in app/globals.css. When the visual identity changes, update both.
 */
export const emailColors = {
  // Hero band: brand emerald
  bandBg: "#0C7A43", // mirrors --color-brand-600
  bandText: "#FFFFFF",

  // Card surface
  cardBg: "#FFFFFF",
  cardBorder: "#DAE0E5", // mirrors --color-ink-200

  // Page surface
  pageBg: "#FAFAF7", // mirrors --color-bg

  // Table cells
  rowBorder: "#F1EFEA", // mirrors --color-surface-muted
  labelText: "#121A1F", // mirrors --color-ink-900
  valueText: "#2F3F47", // mirrors --color-ink-700
} as const;
