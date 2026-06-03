/**
 * Shared knowledge base + engine for the Ammari Dental Assistant chat and
 * the site-wide smart search bar. Pure, isomorphic — no React, no DOM, no
 * Node-only APIs — so both the server route (/api/agent) and the client
 * SearchPalette can import the exact same logic and data.
 *
 *   Chat (server)              SearchPalette (client)
 *        \                          /
 *         \                        /
 *          \--- dental-kb.ts -----/
 *                    |
 *      services + articles + site + intents
 *
 * Adding a new intent or KB entry here automatically improves BOTH surfaces.
 */
import { services, type Service } from "./services";
import { articles, type Article } from "./articles";
import { site } from "./site";

// ── Intents (shared with chat) ────────────────────────────────────────────────

export type Intent =
  | "emergency"
  | "book"
  | "hours"
  | "location"
  | "phone"
  | "insurance"
  | "financing"
  | "family"
  | "anxiety"
  | "service"
  | "greeting"
  | "fallback";

export type Suggestion = { label: string; href?: string; prompt?: string };
export type IntentReply = { reply: string; suggestions?: Suggestion[] };

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function todayDay(): string {
  return DAYS[new Date().getDay()];
}

function fmtHours(): string {
  return site.hours
    .map((h) => {
      if ("closed" in h && h.closed) return `• ${h.day}: closed`;
      const note = "note" in h && h.note ? ` ${h.note}` : "";
      return `• ${h.day}: ${h.open}–${h.close}${note}`;
    })
    .join("\n");
}

function todayHours(): string {
  const today = todayDay();
  const h = site.hours.find((x) => x.day === today);
  if (!h) return `We're closed today.`;
  if ("closed" in h && h.closed) return `We're closed today (${today}).`;
  return `Today (${today}) we're open ${h.open}–${h.close}.`;
}

/** Find the service a phrase mentions, if any. */
export function matchService(text: string): Service | undefined {
  const lower = text.toLowerCase();
  return services.find((s) => {
    const candidates = [s.slug.replace(/-/g, " "), s.name.toLowerCase()];
    return candidates.some((c) => lower.includes(c));
  });
}

/** Classify free-text into one of the shared intents. */
export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (
    /(emergency|urgent|brok(e|en)|chipped|cracked|knocked|tooth ?ache|toothache|severe pain|\bpain\b|\bhurts?\b|aching|swell(ing|ed)|swollen|bleeding|abscess|lost (a |my )?(filling|crown|tooth))/i.test(
      t,
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
      t,
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
  if (/\b(hi|hey|hiya|hello|howdy|good (morning|afternoon|evening))\b/i.test(t))
    return "greeting";
  return "fallback";
}

/** Produce the canned reply + action chips for a given intent + message. */
export function answerForIntent(intent: Intent, message: string): IntentReply {
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
    case "fallback":
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

/** Convenience: classify + answer in one call (chat route uses this). */
export function answer(message: string): IntentReply {
  return answerForIntent(detectIntent(message), message);
}

// ── Search index ─────────────────────────────────────────────────────────────

export type SearchKind =
  | "quick-answer"
  | "service"
  | "article"
  | "page"
  | "staff"
  | "insurance";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  /** When set instead of href, activating opens the chat with this prompt. */
  chatPrompt?: string;
  icon: string;
  kind: SearchKind;
  category?: string;
  score: number;
};

export type SearchGroup = {
  kind: SearchKind;
  label: string;
  items: SearchItem[];
};

export type SearchResult = {
  query: string;
  intent: Intent;
  intentAnswer?: IntentReply;
  groups: SearchGroup[];
  total: number;
};

/** Curated top-level pages worth indexing (routes outside services/articles). */
const PAGES: { title: string; href: string; subtitle?: string; tags: string[] }[] = [
  { title: "Book an Appointment", href: "/appointment", subtitle: "Request a visit online", tags: ["appointment", "book", "schedule", "reserve", "visit"] },
  { title: "Contact Us", href: "/contact", subtitle: site.phone, tags: ["contact", "phone", "email", "message"] },
  { title: "Location & Office Hours", href: "/our-dental-office-location", subtitle: `${site.address.street}, ${site.address.city}`, tags: ["location", "address", "hours", "directions", "map", "office", "parking"] },
  { title: "New Patients", href: "/new-patients", subtitle: "First-visit info & forms", tags: ["new patient", "first visit", "intake", "forms", "paperwork"] },
  { title: "New Patient Forms", href: "/-new-patient-forms", subtitle: "Download paperwork", tags: ["forms", "paperwork", "intake", "download"] },
  { title: "Financing & Payment", href: "/financing", subtitle: "Insurance, CareCredit, Cherry", tags: ["financing", "payment", "cost", "carecredit", "cherry", "loan", "afford", "price", "insurance"] },
  { title: "Meet the Team", href: "/dental-staff", subtitle: "Dr. Ammari & our staff", tags: ["staff", "team", "doctor", "ammari", "about", "hygienist"] },
  { title: "Patient Reviews", href: "/reviews", subtitle: "What patients say", tags: ["reviews", "testimonials", "feedback", "stars"] },
  { title: "Testimonials", href: "/testimonials", subtitle: "Patient stories", tags: ["testimonials", "stories", "reviews"] },
  { title: "Smile Gallery", href: "/gallery", subtitle: "Real before & after photos", tags: ["gallery", "before after", "photos", "smile"] },
  { title: "Comfortable Dentistry", href: "/comfortable-dentistry", subtitle: "Anxiety-friendly care", tags: ["anxiety", "nervous", "scared", "sedation", "nitrous", "comfort", "gentle"] },
  { title: "Post-Op Instructions", href: "/post-op-instructions", subtitle: "After your treatment", tags: ["post op", "after surgery", "instructions", "recovery", "aftercare"] },
  { title: "Surgical Instructions", href: "/surgical-instructions", subtitle: "Before & after surgery", tags: ["surgical", "instructions", "before surgery", "pre op", "preparation"] },
  { title: "Educational Videos", href: "/educational-videos", subtitle: "Watch & learn", tags: ["videos", "education", "learn", "watch"] },
  { title: "Q & A", href: "/-q---a", subtitle: "Common questions", tags: ["q&a", "questions", "faq", "answers"] },
  { title: "Improving Your Smile", href: "/-improving-your-smile", subtitle: "Cosmetic options", tags: ["smile", "cosmetic", "improve", "transform"] },
  { title: "Dental Emergencies", href: "/dental-emergencies", subtitle: "Same-day urgent care", tags: ["emergency", "urgent", "pain", "broken", "swelling", "abscess", "knocked out"] },
];

const STAFF_HREF = "/dental-staff";

// Pre-built index of every searchable entry. Built once at module load —
// the entries are small (<300) so we hold them in memory.
type IndexEntry = {
  kind: SearchKind;
  category?: string;
  /** Visible title. */
  title: string;
  /** Optional supporting line shown beneath the title. */
  subtitle?: string;
  /** Where activation navigates (omitted for chatPrompt entries). */
  href?: string;
  /** When set, activating opens the chat with this prompt. */
  chatPrompt?: string;
  /** Icon name from DentalIcon set. */
  icon: string;
  /** Pre-tokenized search corpus, weighted. */
  fields: { weight: number; text: string }[];
};

function entryFromService(s: Service): IndexEntry {
  return {
    kind: "service",
    category: s.category,
    title: s.name,
    subtitle: s.blurb,
    href: `/${s.slug}`,
    icon: s.icon,
    fields: [
      { weight: 12, text: s.name },
      { weight: 10, text: s.h1 },
      { weight: 6, text: s.slug.replace(/-/g, " ") },
      { weight: 3, text: s.category },
      { weight: 2, text: s.blurb },
    ],
  };
}

function entryFromArticle(a: Article): IndexEntry {
  return {
    kind: "article",
    category: a.topic || a.service,
    title: a.title,
    subtitle: a.topic ? `${a.topic} · article` : "Article",
    href: a.url,
    icon: "tooth-leaf",
    fields: [
      { weight: 10, text: a.title },
      { weight: 4, text: a.topic },
      { weight: 3, text: a.service },
      { weight: 2, text: a.slug.replace(/-/g, " ") },
    ],
  };
}

function entryFromPage(p: (typeof PAGES)[number]): IndexEntry {
  return {
    kind: "page",
    title: p.title,
    subtitle: p.subtitle,
    href: p.href,
    icon: pageIcon(p.title),
    fields: [
      { weight: 12, text: p.title },
      { weight: 4, text: p.subtitle ?? "" },
      { weight: 6, text: p.tags.join(" ") },
    ],
  };
}

function pageIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("appointment") || t.includes("book")) return "calendar";
  if (t.includes("contact") || t.includes("phone")) return "phone";
  if (t.includes("location") || t.includes("hours")) return "anchor";
  if (t.includes("financ") || t.includes("payment") || t.includes("insurance")) return "shield";
  if (t.includes("team") || t.includes("staff") || t.includes("about")) return "heart";
  if (t.includes("review") || t.includes("testimonial")) return "star";
  if (t.includes("gallery") || t.includes("smile")) return "tooth-sparkle";
  if (t.includes("emergency")) return "alert";
  if (t.includes("comfort")) return "tooth-heart";
  if (t.includes("form") || t.includes("instruction") || t.includes("q ")) return "tooth-leaf";
  return "tooth-leaf";
}

function entryFromStaff(s: (typeof site.staff)[number]): IndexEntry {
  const display = s.name || s.role;
  return {
    kind: "staff",
    title: display,
    subtitle: s.name ? s.role : `${s.role} · Ammari Dental`,
    href: STAFF_HREF,
    icon: "heart",
    fields: [
      { weight: 12, text: display },
      { weight: 6, text: s.role },
      { weight: 4, text: s.bio },
    ],
  };
}

function entryFromInsurance(i: (typeof site.insurances)[number]): IndexEntry {
  return {
    kind: "insurance",
    title: i.name,
    subtitle: "In-network · see financing",
    href: "/financing",
    icon: "shield",
    fields: [
      { weight: 14, text: i.name },
      { weight: 4, text: i.slug.replace(/-/g, " ") },
      { weight: 2, text: "insurance carrier in network" },
    ],
  };
}

/**
 * Quick-answer entries are "smart shortcuts" — typing "hours" or "call"
 * surfaces them as the top result with the live data baked in. Activation
 * either navigates somewhere relevant or opens the chat with that prompt.
 */
function quickAnswerEntries(): IndexEntry[] {
  return [
    {
      kind: "quick-answer",
      title: todayHours(),
      subtitle: "Tap to see the full week",
      chatPrompt: "What are your hours?",
      icon: "clock",
      fields: [
        { weight: 18, text: "hours open close today tomorrow time when" },
        { weight: 6, text: "office hours schedule" },
      ],
    },
    {
      kind: "quick-answer",
      title: `Call ${site.phone}`,
      subtitle: "Front desk · during office hours",
      href: `tel:${site.phoneTel}`,
      icon: "phone",
      fields: [
        { weight: 18, text: "call phone number reach contact ring" },
        { weight: 6, text: "speak someone" },
      ],
    },
    {
      kind: "quick-answer",
      title: `Emergency line · ${site.emergencyPhone}`,
      subtitle: "After-hours dental emergencies",
      href: `tel:${site.emergencyTel}`,
      icon: "alert",
      fields: [
        { weight: 18, text: "emergency urgent pain hurt broken bleeding swelling abscess after hours" },
        { weight: 6, text: "tooth ache knocked out" },
      ],
    },
    {
      kind: "quick-answer",
      title: "Book an appointment",
      subtitle: "Request a visit online",
      href: "/appointment",
      icon: "calendar",
      fields: [
        { weight: 18, text: "book appointment schedule visit reserve new patient first time" },
        { weight: 4, text: "calendar" },
      ],
    },
    {
      kind: "quick-answer",
      title: "Get directions",
      subtitle: `${site.address.street}, ${site.address.city}`,
      href: site.social.google,
      icon: "anchor",
      fields: [
        { weight: 16, text: "directions address location map where parking drive" },
        { weight: 4, text: "find us" },
      ],
    },
    {
      kind: "quick-answer",
      title: "Insurance & financing",
      subtitle: "Plans accepted, CareCredit, Cherry",
      href: "/financing",
      icon: "shield",
      fields: [
        { weight: 14, text: "insurance financing cost price pay afford payment carecredit cherry coverage" },
        { weight: 4, text: "ppo plan covered" },
      ],
    },
  ];
}

const INDEX: IndexEntry[] = [
  ...quickAnswerEntries(),
  ...services.map(entryFromService),
  ...articles.map(entryFromArticle),
  ...PAGES.map(entryFromPage),
  ...site.staff.filter((s) => s.name || s.role).map(entryFromStaff),
  ...site.insurances.map(entryFromInsurance),
];

// ── Search ───────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntry(query: string, entry: IndexEntry): number {
  const q = normalize(query);
  if (!q) return 0;
  const terms = q.split(/\s+/).filter((t) => t.length >= 2);
  if (!terms.length) return 0;

  let total = 0;
  for (const f of entry.fields) {
    const text = normalize(f.text);
    if (!text) continue;
    // Phrase / prefix bonuses
    if (text === q) total += f.weight * 12;
    else if (text.startsWith(q)) total += f.weight * 8;
    else if (text.includes(q)) total += f.weight * 4;
    // Per-term contributions
    for (const term of terms) {
      if (text.includes(` ${term} `) || text.startsWith(`${term} `) || text.endsWith(` ${term}`) || text === term) {
        total += f.weight * 2;
      } else if (text.includes(term)) {
        total += f.weight;
      }
    }
  }
  return total;
}

const KIND_ORDER: SearchKind[] = [
  "quick-answer",
  "service",
  "page",
  "article",
  "staff",
  "insurance",
];

const KIND_LABELS: Record<SearchKind, string> = {
  "quick-answer": "Quick answers",
  service: "Services",
  page: "Pages",
  article: "Articles",
  staff: "Our team",
  insurance: "Insurance",
};

/**
 * Search the shared KB. Returns:
 *  - the detected intent (so the UI can render a "smart answer" card),
 *  - grouped results ranked within each group,
 *  - the total count across all groups.
 *
 * Caps each group to keep the panel tight; total limit also enforced.
 */
export function searchKB(query: string, opts?: { perGroup?: number; total?: number }): SearchResult {
  const q = query.trim();
  const perGroup = opts?.perGroup ?? 5;
  const totalCap = opts?.total ?? 18;

  const intent = q ? detectIntent(q) : "fallback";
  const intentAnswer = q && intent !== "fallback" && intent !== "service" && intent !== "greeting"
    ? answerForIntent(intent, q)
    : undefined;

  if (!q) {
    return { query: q, intent, intentAnswer, groups: [], total: 0 };
  }

  const scored: (IndexEntry & { score: number })[] = INDEX
    .map((e) => ({ ...e, score: scoreEntry(q, e) }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);

  const groupsMap = new Map<SearchKind, SearchItem[]>();
  let placed = 0;
  for (const e of scored) {
    if (placed >= totalCap) break;
    const arr = groupsMap.get(e.kind) ?? [];
    if (arr.length >= perGroup) continue;
    arr.push({
      id: `${e.kind}:${e.href ?? e.chatPrompt ?? e.title}`,
      title: e.title,
      subtitle: e.subtitle,
      href: e.href,
      chatPrompt: e.chatPrompt,
      icon: e.icon,
      kind: e.kind,
      category: e.category,
      score: e.score,
    });
    groupsMap.set(e.kind, arr);
    placed++;
  }

  const groups: SearchGroup[] = KIND_ORDER
    .filter((k) => groupsMap.has(k))
    .map((k) => ({ kind: k, label: KIND_LABELS[k], items: groupsMap.get(k)! }));

  return { query: q, intent, intentAnswer, groups, total: placed };
}

/**
 * "Idle" state for the search palette — what to show before the user types.
 * Curated: top quick actions, then the featured services. Mirrors the chat's
 * greeting suggestions so the two surfaces feel like one product.
 */
export function idleSuggestions(): { quickActions: SearchItem[]; popular: SearchItem[] } {
  const qaTitles = ["Book an appointment", `Call ${site.phone}`, `Emergency line · ${site.emergencyPhone}`, "Get directions"];
  const quickActions = INDEX
    .filter((e) => e.kind === "quick-answer" && qaTitles.includes(e.title))
    .map((e, i) => ({
      id: `idle-qa:${i}`,
      title: e.title,
      subtitle: e.subtitle,
      href: e.href,
      chatPrompt: e.chatPrompt,
      icon: e.icon,
      kind: e.kind,
      score: 0,
    }));

  const popular = services
    .filter((s) => s.featured)
    .slice(0, 5)
    .map((s) => ({
      id: `idle-pop:${s.slug}`,
      title: s.name,
      subtitle: s.blurb,
      href: `/${s.slug}`,
      icon: s.icon,
      kind: "service" as const,
      category: s.category,
      score: 0,
    }));

  return { quickActions, popular };
}

// Re-export helpers for the chat route's convenience.
export const _kb = { todayHours, fmtHours, todayDay };
