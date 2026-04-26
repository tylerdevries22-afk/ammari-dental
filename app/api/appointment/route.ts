import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

type AppointmentPayload = {
  name?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  reason?: string;
  message?: string;
  website?: string;
};

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentPayload;

    if (body?.website) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.APPOINTMENT_TO_EMAIL;
    const from = process.env.APPOINTMENT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      console.log("[appointment]", body);
      return NextResponse.json({ ok: true, queued: true });
    }

    const resend = new Resend(apiKey);

    const rows = [
      ["Name", body.name],
      ["Email", body.email],
      ["Phone", body.phone],
      ["Preferred date", body.preferredDate],
      ["Preferred time", body.preferredTime],
      ["Reason", body.reason],
      ["Message", body.message],
    ]
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid #eef2f7;font-weight:600;color:#0F2538">${escape(
            String(k),
          )}</td><td style="padding:6px 12px;border-bottom:1px solid #eef2f7;color:#23435F">${escape(
            String(v),
          )}</td></tr>`,
      )
      .join("");

    const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F7FAFC;padding:24px">
<table style="background:#fff;border-radius:14px;width:100%;max-width:560px;margin:0 auto;border:1px solid #DCE8F2;overflow:hidden">
<tr><td style="padding:20px 24px;background:#1F6FAE;color:#fff;font-size:16px;font-weight:600">${site.name} — New Appointment Request</td></tr>
<tr><td style="padding:8px 0"><table style="width:100%;border-collapse:collapse">${rows}</table></td></tr>
</table></body></html>`;

    await resend.emails.send({
      from,
      to,
      subject: `Appointment request — ${body.name ?? "new patient"}`,
      replyTo: body.email,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[appointment] failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
