import { site } from "@/lib/site";

/**
 * Minimal RFC 5545 .ics builder for booking confirmations.
 * No external deps — we own ~30 lines vs. pulling in a calendar library.
 */

function fmt(iso: string): string {
  // 20260603T143000Z — strip punctuation, force UTC suffix.
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function buildIcs(opts: {
  bookingId: string;
  startIso: string;
  endIso: string;
  summary: string;
  description?: string;
}): string {
  const address = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.name}//Booking//EN`,
    "METHOD:PUBLISH",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.bookingId}@auroragentledentist.com`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(opts.startIso)}`,
    `DTEND:${fmt(opts.endIso)}`,
    `SUMMARY:${esc(opts.summary)}`,
    `LOCATION:${esc(address)}`,
    opts.description ? `DESCRIPTION:${esc(opts.description)}` : "",
    `ORGANIZER;CN=${esc(site.name)}:MAILTO:${site.email}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  // RFC 5545 line endings.
  return lines.join("\r\n");
}
