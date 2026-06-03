import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { site } from "@/lib/site";

const AGENT_ID = "ammari-dental-bot-v1";

type Step = "await_name" | "await_contact" | "await_need" | "open";

type Session = {
  step: Step;
  lead_id: string | null;
  name: string | null;
};

type ChatRequest = {
  message: string;
  session: Session;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function detectPhone(text: string) {
  // Matches: 303-283-8009 | (303) 283-8009 | 999-9999 | 9999999 | +1 303...
  return /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|^\d{7}$|^\d{3}[-.\s]\d{4}$/.test(
    text.trim(),
  );
}

function detectEmail(text: string) {
  return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
}

/** Pull a clean service tag from the user's raw message */
function extractServiceInterest(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(emergency|urgent|broke|broken|cracked|knocked|pain|hurts|bleeding|swollen|abscess)\b/.test(lower)) return "emergency";
  if (/\b(implant|missing tooth|missing teeth)\b/.test(lower)) return "dental implants";
  if (/\b(whitening|whiten|bright|bleach)\b/.test(lower)) return "teeth whitening";
  if (/\b(veneer|veneers|smile makeover)\b/.test(lower)) return "veneers";
  if (/\b(root canal)\b/.test(lower)) return "root canal";
  if (/\b(clean|cleaning|hygiene)\b/.test(lower)) return "cleaning";
  if (/\b(checkup|check-up|exam|exam)\b/.test(lower)) return "exam";
  if (/\b(crown|cap)\b/.test(lower)) return "crown";
  if (/\b(filling|cavity|cavities)\b/.test(lower)) return "filling";
  if (/\b(extraction|pull|remove tooth)\b/.test(lower)) return "extraction";
  if (/\b(invisalign|braces|orthodont|align)\b/.test(lower)) return "orthodontics";
  if (/\b(cosmetic|smile)\b/.test(lower)) return "cosmetic dentistry";
  if (/\b(kid|child|children|pediatric|family)\b/.test(lower)) return "family dentistry";
  if (/\b(insurance|coverage|plan)\b/.test(lower)) return "insurance question";
  return text.length > 60 ? text.slice(0, 60) + "…" : text;
}

/** Determine urgency score and lead status */
function qualifyLead(serviceInterest: string, rawMessage: string): { urgency: string | null; status: string } {
  const lower = (serviceInterest + " " + rawMessage).toLowerCase();
  if (/\b(emergency|urgent|immediately|asap|today|pain|hurts|broke|cracked|bleeding|swollen|abscess)\b/.test(lower)) {
    return { urgency: "urgent", status: "hot" };
  }
  if (/\b(soon|this week|schedule|appointment|book)\b/.test(lower)) {
    return { urgency: "high", status: "warm" };
  }
  return { urgency: null, status: "need_identified" };
}

/** Build a smart reply handling MULTIPLE topics from one message */
function buildReply(text: string, name: string | null): string {
  const lower = text.toLowerCase();
  const greet = name ? `${name.split(" ")[0]}, ` : "";
  const parts: string[] = [];

  // Emergency — highest priority, answer first
  if (/\b(emergency|urgent|pain|hurts|broken|cracked|knocked|bleeding|swollen|abscess|immediately|asap)\b/.test(lower)) {
    parts.push(
      `🚨 For dental emergencies please call us **immediately** at **${site.emergencyPhone}**. We do our best to see urgent cases same-day.`,
    );
  }

  // Insurance — answer this directly if asked
  if (/\b(insurance|coverage|plan|network|delta dental|cigna|aetna|humana|united|anthem|metlife|guardian)\b/.test(lower)) {
    const mentioned: string[] = [];
    if (/delta dental/.test(lower)) mentioned.push("Delta Dental");
    if (/cigna/.test(lower)) mentioned.push("Cigna");
    if (/aetna/.test(lower)) mentioned.push("Aetna");
    if (/humana/.test(lower)) mentioned.push("Humana");
    if (/united/.test(lower)) mentioned.push("United Healthcare");
    if (/anthem/.test(lower)) mentioned.push("Anthem BCBS");
    if (/metlife/.test(lower)) mentioned.push("MetLife");
    if (/guardian/.test(lower)) mentioned.push("Guardian");

    if (mentioned.length > 0) {
      parts.push(`✅ Yes — we are **in-network with ${mentioned.join(", ")}**. We also accept Aetna, Cigna, Humana, MetLife, Guardian, United Healthcare, Medicaid (Dentaquest), and 15+ other plans. Our team will verify your benefits before your visit.`);
    } else {
      parts.push(`✅ We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, United Healthcare, Humana, MetLife, and 15 more. Call us at **${site.phone}** and we'll verify your coverage before your visit.`);
    }
  }

  // Hours
  if (/\b(hours|open|close|when|schedule|today|what time)\b/.test(lower) && !/\b(emergency|immediately)\b/.test(lower)) {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayHours = site.hours.find((h) => h.day === today);
    const todayStr = todayHours
      ? "closed" in todayHours && todayHours.closed
        ? `We're closed today (${today}).`
        : `Today (${today}) we're open **${todayHours.open}–${todayHours.close}**.`
      : "";
    const allHours = site.hours
      .map((h) => ("closed" in h && h.closed ? `${h.day}: Closed` : `${h.day}: ${h.open}–${h.close}`))
      .join(" | ");
    parts.push(`🕐 ${todayStr}\nFull schedule: ${allHours}`);
  }

  // Booking / appointment
  if (/\b(book|appointment|schedule|visit|come in|see you|reserve|slot)\b/.test(lower) && parts.length === 0) {
    parts.push(
      `📅 You can book online at [auroragentledentist.com/appointment](${site.url}/appointment) or call us at **${site.phone}**. We'll get you set up quickly!`,
    );
  }

  // Cost
  if (/\b(cost|price|fee|charge|how much|afford|expensive)\b/.test(lower)) {
    parts.push(`💰 Costs vary by treatment. With insurance, many routine services are fully covered. We'll give you a full breakdown before any procedure — no surprises. Financing options are also available.`);
  }

  // Specific services
  if (/\b(whitening|whiten|bright|bleach)\b/.test(lower) && parts.length === 0) {
    parts.push(`✨ We offer professional teeth whitening — faster and more effective than over-the-counter options. Ask about it at your next visit or book a consult at ${site.url}/appointment.`);
  }
  if (/\b(implant)\b/.test(lower) && parts.length === 0) {
    parts.push(`🦷 Dental implants are one of the best long-term solutions for missing teeth. Dr. Ammari can evaluate whether you're a good candidate. Book a consult at ${site.url}/appointment.`);
  }
  if (/\b(clean|cleaning|hygiene|checkup|check-up|exam)\b/.test(lower) && parts.length === 0) {
    parts.push(`🦷 We recommend cleanings and exams every 6 months. Most insurance plans cover two per year at 100%. Book at ${site.url}/appointment or call ${site.phone}.`);
  }

  // Gratitude
  if (/\b(thank|thanks|great|perfect|awesome|good|appreciate)\b/.test(lower) && parts.length === 0) {
    parts.push(`You're very welcome, ${greet}We look forward to seeing you at Ammari Dental! 😊`);
  }

  // Fallback
  if (parts.length === 0) {
    parts.push(
      `Thanks for your message, ${greet}I've noted that for our team. For immediate assistance please call **${site.phone}** or book online at ${site.url}/appointment.`,
    );
  }

  return parts.join("\n\n");
}

async function logConversation(
  db: ReturnType<typeof supabaseAdmin>,
  lead_id: string,
  message: string,
  sender: "user" | "agent",
) {
  await db.from("conversations").insert({ lead_id, message, sender, agent_id: AGENT_ID });
}

async function logEvent(
  db: ReturnType<typeof supabaseAdmin>,
  event_type: string,
  payload: Record<string, unknown>,
) {
  await db.from("ai_events").insert({ event_type, payload, agent_id: AGENT_ID });
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const { message, session } = (await request.json()) as ChatRequest;
    const db = supabaseAdmin();
    let { step, lead_id, name } = session;
    let reply = "";

    if (step === "await_name") {
      const trimmedName = message.trim();

      const { data: lead } = await db
        .from("leads")
        .insert({ name: trimmedName, status: "chat_started" })
        .select("id")
        .single();

      lead_id = lead?.id ?? null;
      name = trimmedName;

      if (lead_id) {
        await logConversation(db, lead_id, message, "user");
        await logEvent(db, "lead_created", { lead_id, name: trimmedName, source: "chat" });
      }

      reply = `Nice to meet you, ${trimmedName.split(" ")[0]}! What's your best phone number or email so our team can reach you?`;
      step = "await_contact";

    } else if (step === "await_contact") {
      if (lead_id) await logConversation(db, lead_id, message, "user");

      const isPhone = detectPhone(message);
      const isEmail = detectEmail(message);
      const hasContact = isPhone || isEmail;

      if (lead_id && hasContact) {
        await db.from("leads").update({
          ...(isPhone ? { phone: message.trim() } : {}),
          ...(isEmail ? { email: message.trim() } : {}),
          status: "contact_collected",
        }).eq("id", lead_id);
        await logEvent(db, "contact_collected", { lead_id, contact: message.trim(), type: isPhone ? "phone" : "email" });
      } else if (lead_id) {
        // Couldn't parse as contact — store as note and move on
        await db.from("leads").update({ status: "contact_collected" }).eq("id", lead_id);
        await logEvent(db, "contact_noted", { lead_id, raw: message.trim() });
      }

      reply = `Got it${name ? `, ${name.split(" ")[0]}` : ""}! What brings you in today? For example: routine cleaning, toothache, cosmetic work, or something else?`;
      step = "await_need";

    } else if (step === "await_need") {
      if (lead_id) await logConversation(db, lead_id, message, "user");

      const serviceInterest = extractServiceInterest(message);
      const { urgency, status } = qualifyLead(serviceInterest, message);

      if (lead_id) {
        await db.from("leads").update({
          service_interest: serviceInterest,
          urgency,
          status,
        }).eq("id", lead_id);
        await logEvent(db, "lead_qualified", { lead_id, service_interest: serviceInterest, urgency, status });

        if (status === "hot") {
          await logEvent(db, "hot_lead_detected", {
            lead_id,
            name,
            service_interest: serviceInterest,
            urgency,
            alert: "Requires immediate follow-up",
          });
        }
      }

      reply = buildReply(message, name);
      step = "open";

    } else {
      // open conversation
      if (lead_id) {
        await logConversation(db, lead_id, message, "user");
        await logEvent(db, "chat_message", { lead_id, message });

        // Re-qualify if they mention something urgent mid-conversation
        const serviceInterest = extractServiceInterest(message);
        const { urgency, status } = qualifyLead(serviceInterest, message);
        if (status === "hot") {
          await db.from("leads").update({ urgency, status }).eq("id", lead_id);
          await logEvent(db, "hot_lead_detected", { lead_id, name, trigger: message, urgency });
        }
      }

      reply = buildReply(message, name);
    }

    // Log bot reply
    if (lead_id) {
      await logConversation(db, lead_id, reply, "agent");
    }

    return NextResponse.json({ reply, session: { step, lead_id, name } });
  } catch (err) {
    console.error("[chat] error", err);
    return NextResponse.json(
      {
        reply: `Sorry, something went wrong. Please call us at ${site.phone}.`,
        session: { step: "open", lead_id: null, name: null },
      },
      { status: 200 },
    );
  }
}
