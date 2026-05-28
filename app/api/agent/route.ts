import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Body = { message?: string; history?: ChatMessage[] };

type Suggestion = { label: string; href?: string; prompt?: string };
type Reply = { reply: string; suggestions?: Suggestion[] };

const TODAY_DAY = () =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    new Date().getDay()
  ];

function fmtHours() {
  return site.hours
    .map((h) => {
      if ("closed" in h && h.closed) return `• ${h.day}: closed`;
      const note = "note" in h && h.note ? ` ${h.note}` : "";
      return `• ${h.day}: ${h.open}–${h.close}${note}`;
    })
    .join("\n");
}

function todayHours(): string {
  const today = TODAY_DAY();
  const h = site.hours.find((x) => x.day === today);
  if (!h) return `We're closed today.`;
  if ("closed" in h && h.closed) return `We're closed today (${today}).`;
  return `Today (${today}) we're open ${h.open}–${h.close}.`;
}

function matchService(text: string) {
  const lower = text.toLowerCase();
  return services.find((s) => {
    const candidates = [s.slug.replace(/-/g, " "), s.name.toLowerCase()];
    return candidates.some((c) => lower.includes(c));
  });
}

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (
    /(emergency|urgent|brok(e|en)|chipped|cracked|knocked|tooth ?ache|toothache|severe pain|\bpain\b|\bhurts?\b|aching|swell(ing|ed)|swollen|bleeding|abscess|lost (a |my )?(filling|crown|tooth))/i.test(
      t
    )
  )
    return "emergency";
  if (/(book|appointment|schedule|reserve|new patient|first time|visit)/i.test(t))
    return "book";
  if (/(hours?|open|close[ds]?|today|tomorrow|when.*open|what.*time)/i.test(t))
    return "hours";
  if (/(where|address|location|directions|map|drive|park|near)/i.test(t))
    return "location";
  if (/(phone|call|number|reach|contact)/i.test(t)) return "phone";
  if (
    /(insurance|covered|carrier|in.network|aetna|cigna|delta|metlife|guardian|humana|united|anthem|medicaid)/i.test(
      t
    )
  )
    return "insurance";
  if (/(cost|price|how much|afford|pay|financing|cherry|carecredit|loan)/i.test(t))
    return "financing";
  if (/(child|kid|family|pediatric|baby|toddler|son|daughter)/i.test(t))
    return "family";
  if (/(anxious|nervous|afraid|scared|fear|calm|gentle|sedation|comfort)/i.test(t))
    return "anxiety";
  if (matchService(t)) return "service";
  if (/\b(hi|hey|hiya|hello|howdy|good (morning|afternoon|evening))\b/i.test(t)) return "greeting";
  return "fallback";
}

function generateReply(message: string): Reply {
  const intent = detectIntent(message);

  switch (intent) {
    case "emergency":
      return {
        reply: `If you're in pain or had a dental emergency, please call us right away.\n\nDuring office hours: ${site.phone}\nAfter-hours: ${site.emergencyPhone}\n\nWe reserve same-day slots for true emergencies (broken or knocked-out teeth, severe pain, swelling). Stay calm — we'll get you in fast.`,
        suggestions: [
          { label: `Call ${site.phone}`, href: `tel:${site.phoneTel}` },
          { label: "Emergency info", href: "/dental-emergencies" },
        ],
      };

    case "book":
      return {
        reply: `Happy to help you get scheduled! You can pick a date and time below — request a slot and the front desk will confirm by phone or email. New patients welcome.`,
        suggestions: [
          { label: "Open booking calendar", href: "/appointment" },
          { label: "New patient info", href: "/new-patients" },
          { label: `Or call ${site.phone}`, href: `tel:${site.phoneTel}` },
        ],
      };

    case "hours":
      return {
        reply: `${todayHours()}\n\nFull hours:\n${fmtHours()}`,
        suggestions: [
          { label: "Get directions", href: site.social.google },
          { label: "Book a visit", prompt: "I'd like to book an appointment" },
        ],
      };

    case "location":
      return {
        reply: `We're at ${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}. Free parking right out front, easy access from S Chambers Rd.`,
        suggestions: [
          { label: "Open in Google Maps", href: site.social.google },
          { label: "See office hours", prompt: "What are your hours?" },
        ],
      };

    case "phone":
      return {
        reply: `You can reach us at ${site.phone} during office hours. For after-hours dental emergencies call ${site.emergencyPhone}.`,
        suggestions: [
          { label: `Call ${site.phone}`, href: `tel:${site.phoneTel}` },
          { label: "Send a message", href: "/contact" },
        ],
      };

    case "insurance": {
      const top = site.insurances.slice(0, 8).map((i) => i.name).join(", ");
      return {
        reply: `We accept most major PPO plans, including ${top} — and many others. We'll verify your benefits before treatment so there are no surprises.`,
        suggestions: [
          { label: "See full insurance list", href: "/financing" },
          { label: "Book an appointment", prompt: "I'd like to book an appointment" },
        ],
      };
    }

    case "financing":
      return {
        reply: `We work with most insurance plans and offer in-house payment options plus third-party financing (Cherry, CareCredit) for larger treatments. Many cleanings and exams are fully covered. Want help estimating a specific procedure?`,
        suggestions: [
          { label: "Financing options", href: "/financing" },
          { label: "Ask about a service", prompt: "Tell me about teeth whitening" },
        ],
      };

    case "family":
      return {
        reply: `Yes — we love treating families. Dr. Ammari sees patients of all ages, including kids. We keep the experience calm and friendly, and parents are welcome to sit with their child during the visit.`,
        suggestions: [
          { label: "Comfortable dentistry", href: "/comfortable-dentistry" },
          { label: "Schedule a family visit", prompt: "I'd like to book an appointment" },
        ],
      };

    case "anxiety":
      return {
        reply: `Dental anxiety is very common, and it's something we take seriously. We pace your visit, explain everything before we do it, and offer comfort options including nitrous (laughing gas). Many patients tell us we're the most relaxed dental experience they've had.`,
        suggestions: [
          { label: "Comfortable dentistry", href: "/comfortable-dentistry" },
          { label: "Read patient stories", href: "/testimonials" },
        ],
      };

    case "service": {
      const s = matchService(message)!;
      return {
        reply: `${s.h1}: ${s.blurb}\n\nWant to learn more or get scheduled?`,
        suggestions: [
          { label: `Read about ${s.name}`, href: `/${s.slug}` },
          { label: "Book this service", prompt: `I'd like to book a ${s.name} appointment` },
        ],
      };
    }

    case "greeting":
      return {
        reply: `Hi! I'm the Ammari Dental assistant. I can answer questions about hours, services, insurance, and help you get scheduled. What can I help with?`,
        suggestions: [
          { label: "Book an appointment", prompt: "I'd like to book an appointment" },
          { label: "What services do you offer?", prompt: "What services do you offer?" },
          { label: "Do you take my insurance?", prompt: "Do you take my insurance?" },
        ],
      };

    default:
      return {
        reply: `I can help with hours, services, insurance, financing, or scheduling a visit. For anything specific to your care, ${site.phone} reaches the front desk.`,
        suggestions: [
          { label: "Hours & location", prompt: "What are your hours?" },
          { label: "Services we offer", prompt: "What services do you offer?" },
          { label: "Book a visit", prompt: "I'd like to book an appointment" },
          { label: "Insurance accepted", prompt: "Do you take my insurance?" },
        ],
      };
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const reply = generateReply(message);
  return NextResponse.json(reply);
}
