import { Resend } from "resend";
import { site } from "@/lib/site";
import { emailColors as c } from "@/lib/email-tokens";

/**
 * Booking transactional emails.
 *
 * Two notifications per confirm:
 *   1. Patient receipt — confirmation, address, manage link.
 *   2. Front-desk notice — same row format as the legacy /api/appointment.
 *
 * Both calls are best-effort: failures log and resolve, never propagate to
 * the user. The appointment is already booked in NexHealth at this point;
 * a dropped email is a follow-up issue, not a booking failure.
 */

type Args = {
  bookingId: string;
  startIso: string;
  endIso: string;
  providerName: string;
  reasonLabel: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    insuranceCarrier?: string;
    notes?: string;
  };
  manageUrl: string;
  icsUrl: string;
};

function escape(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch] as string));
}

function fmtRange(startIso: string, endIso: string): string {
  const date = new Date(startIso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Denver",
  });
  const start = new Date(startIso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
  const end = new Date(endIso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
  return `${date} · ${start} – ${end} MT`;
}

export async function sendBookingEmails(args: Args): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPOINTMENT_FROM_EMAIL;
  const frontDesk = process.env.APPOINTMENT_TO_EMAIL;

  if (!apiKey || !from) {
    return; // Silent no-op in dev / preview without keys.
  }

  const resend = new Resend(apiKey);
  const when = fmtRange(args.startIso, args.endIso);
  const address = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

  // 1. Patient receipt
  const patientHtml = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${c.pageBg};padding:24px">
<table style="background:${c.cardBg};border-radius:14px;width:100%;max-width:560px;margin:0 auto;border:1px solid ${c.cardBorder};overflow:hidden">
  <tr><td style="padding:20px 24px;background:${c.bandBg};color:${c.bandText};font-size:16px;font-weight:600">${escape(site.name)} — Appointment confirmed</td></tr>
  <tr><td style="padding:24px">
    <p style="margin:0 0 12px;color:${c.labelText};font-size:18px">Hi ${escape(args.patient.firstName)},</p>
    <p style="margin:0 0 16px;color:${c.valueText}">You're booked for <strong>${escape(args.reasonLabel)}</strong> with <strong>${escape(args.providerName)}</strong>.</p>
    <p style="margin:0 0 8px;color:${c.labelText};font-weight:600">${escape(when)}</p>
    <p style="margin:0 0 24px;color:${c.valueText}">${escape(address)}</p>
    <p style="margin:0 0 8px;color:${c.valueText}">Need to reschedule or cancel?</p>
    <p style="margin:0 0 24px"><a href="${args.manageUrl}" style="color:${c.bandBg};font-weight:600">Manage your appointment</a> &nbsp;·&nbsp; <a href="${args.icsUrl}" style="color:${c.bandBg};font-weight:600">Add to calendar</a></p>
    <p style="margin:0;color:${c.valueText};font-size:14px">Questions? Call ${escape(site.phone)} or reply to this email.</p>
  </td></tr>
</table></body></html>`;

  await resend.emails
    .send({
      from,
      to: args.patient.email,
      subject: `Appointment confirmed — ${when}`,
      html: patientHtml,
    })
    .catch((err) => {
      console.error("[booking] patient email failed", err);
    });

  // 2. Front-desk notice
  if (frontDesk) {
    const rows = [
      ["Name", `${args.patient.firstName} ${args.patient.lastName}`],
      ["Email", args.patient.email],
      ["Phone", args.patient.phone],
      ["When", when],
      ["Provider", args.providerName],
      ["Reason", args.reasonLabel],
      ["Insurance", args.patient.insuranceCarrier ?? ""],
      ["Notes", args.patient.notes ?? ""],
      ["Booking ID", args.bookingId],
    ]
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid ${c.rowBorder};font-weight:600;color:${c.labelText}">${escape(String(k))}</td><td style="padding:6px 12px;border-bottom:1px solid ${c.rowBorder};color:${c.valueText}">${escape(String(v))}</td></tr>`,
      )
      .join("");

    const frontHtml = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${c.pageBg};padding:24px">
<table style="background:${c.cardBg};border-radius:14px;width:100%;max-width:560px;margin:0 auto;border:1px solid ${c.cardBorder};overflow:hidden">
  <tr><td style="padding:20px 24px;background:${c.bandBg};color:${c.bandText};font-size:16px;font-weight:600">${escape(site.name)} — New self-service booking</td></tr>
  <tr><td style="padding:8px 0"><table style="width:100%;border-collapse:collapse">${rows}</table></td></tr>
</table></body></html>`;

    await resend.emails
      .send({
        from,
        to: frontDesk,
        subject: `New booking — ${args.patient.firstName} ${args.patient.lastName}`,
        replyTo: args.patient.email,
        html: frontHtml,
      })
      .catch((err) => {
        console.error("[booking] front-desk email failed", err);
      });
  }
}
