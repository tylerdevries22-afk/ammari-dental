import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { emailColors } from "@/lib/email-tokens";
import { appointmentSchema, APPOINTMENT_EMAIL_ROWS } from "@/lib/appointment";

/** Reject oversized bodies before parsing them. Generous vs. the schema caps. */
const MAX_BODY_BYTES = 16 * 1024;
const SEND_TIMEOUT_MS = 10_000;

function escape(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch] as string));
}

/**
 * Resend's SDK resolves `{ data, error }` rather than throwing on API errors,
 * so a failed send must be detected by inspecting `error` — not by try/catch.
 * Wrapped with a timeout and one retry per the project's external-call standard.
 */
async function sendWithRetry(
  resend: Resend,
  payload: Parameters<Resend["emails"]["send"]>[0],
) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        resend.emails.send(payload),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("resend timeout")), SEND_TIMEOUT_MS);
        }),
      ]);
      if (!result.error) return { ok: true as const };
      lastError = result.error;
    } catch (err) {
      lastError = err;
    } finally {
      // Without this a fast success still pins a 10s timer on the instance.
      clearTimeout(timer);
    }
  }

  return { ok: false as const, error: lastError };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot is checked before validation so bots get an indistinguishable 200.
  if (typeof raw === "object" && raw !== null && (raw as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPOINTMENT_TO_EMAIL;
  const from = process.env.APPOINTMENT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Never log the payload itself — it carries patient contact details.
    console.error(
      "[appointment] email is not configured; request rejected so the lead is not silently lost",
      {
        hasApiKey: Boolean(apiKey),
        hasTo: Boolean(to),
        hasFrom: Boolean(from),
      },
    );
    return NextResponse.json(
      { ok: false, error: "Appointment requests are temporarily unavailable." },
      { status: 503 },
    );
  }

  const c = emailColors;
  const rows = APPOINTMENT_EMAIL_ROWS.map(([label, key]) => [label, data[key]] as const)
    .filter(([, v]) => v)
    .map(
      ([label, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid ${c.rowBorder};font-weight:600;color:${c.labelText}">${escape(
          String(label),
        )}</td><td style="padding:6px 12px;border-bottom:1px solid ${c.rowBorder};color:${c.valueText}">${escape(
          String(v),
        )}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${c.pageBg};padding:24px">
<table style="background:${c.cardBg};border-radius:14px;width:100%;max-width:560px;margin:0 auto;border:1px solid ${c.cardBorder};overflow:hidden">
<tr><td style="padding:20px 24px;background:${c.bandBg};color:${c.bandText};font-size:16px;font-weight:600">${site.name} — New Appointment Request</td></tr>
<tr><td style="padding:8px 0"><table style="width:100%;border-collapse:collapse">${rows}</table></td></tr>
</table></body></html>`;

  const result = await sendWithRetry(new Resend(apiKey), {
    from,
    to,
    subject: `Appointment request — ${data.name}`,
    replyTo: data.email,
    html,
  });

  if (!result.ok) {
    console.error("[appointment] send failed after retry", result.error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
