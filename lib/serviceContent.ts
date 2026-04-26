import type { ServiceKey } from "./services";

type Content = {
  intro: string;
  benefits?: { title: string; body: string }[];
  process?: { title: string; body: string }[];
  faq?: { q: string; a: string }[];
};

const baseFAQ: { q: string; a: string }[] = [
  {
    q: "Do you accept my insurance?",
    a: "We are in-network with most major dental insurance plans including Aetna, Delta Dental, Cigna, United Healthcare, and Medicaid. Call us at (303) 283-8009 and we'll verify your benefits.",
  },
  {
    q: "How do I schedule an appointment?",
    a: "Use our online appointment request form, or call (303) 283-8009 during business hours. We'll get back to you within one business day to confirm.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes — we offer flexible payment options and accept CareCredit. Visit our Financing page for full details.",
  },
];

export const serviceContent: Record<ServiceKey, Content> = {
  "dental-services": {
    intro:
      "Comprehensive general dentistry — exams, X-rays, professional cleanings, and personalized preventive care that keeps your smile healthy for life. We see patients of all ages, from children to seniors.",
    benefits: [
      { title: "Comprehensive exams", body: "Thorough oral health assessments at every visit." },
      { title: "Gentle cleanings", body: "Hygienist-led cleanings tailored to your needs." },
      { title: "Digital X-rays", body: "Lower-radiation imaging for accurate diagnostics." },
      { title: "Whole-family care", body: "From toddlers to grandparents, all under one roof." },
    ],
    faq: baseFAQ,
  },
  "comfortable-dentistry": {
    intro:
      "Anxiety about the dentist is real — and we take it seriously. Our office is designed around your comfort, with gentle techniques, sedation options, and a team trained to put nervous patients at ease.",
    benefits: [
      { title: "Anxiety-aware approach", body: "Slow, communicative care, no surprises." },
      { title: "Sedation options", body: "Ask us about nitrous and oral sedation." },
      { title: "Quiet, calm office", body: "A peaceful space that doesn't feel clinical." },
    ],
    faq: baseFAQ,
  },
  "dental-emergencies": {
    intro:
      "Cracked tooth, severe pain, swelling, lost crown, knocked-out tooth — call us right away. We reserve same-day appointments for urgent dental needs and provide an after-hours emergency line.",
    process: [
      { title: "Call us", body: "(303) 283-8009 during the day, 720-443-8178 after hours." },
      { title: "Triage", body: "We'll assess severity and get you in fast." },
      { title: "Treatment", body: "We'll relieve pain and stabilize your tooth on day one." },
      { title: "Follow-up", body: "We'll plan any longer-term restoration with you." },
    ],
    faq: baseFAQ,
  },
  "teeth-whitening": {
    intro:
      "Brighten your smile by several shades with safe, professional whitening. We offer in-office treatments and custom take-home trays — both more effective and gentler than over-the-counter options.",
    benefits: [
      { title: "Professional strength", body: "Faster, more uniform results than store kits." },
      { title: "Custom-fit trays", body: "Whitening that fits your teeth exactly." },
      { title: "Sensitivity care", body: "Built-in protocols for sensitive teeth." },
    ],
    faq: baseFAQ,
  },
  bonding: {
    intro:
      "Cosmetic bonding uses tooth-colored composite resin to repair chips, close gaps, and reshape teeth — usually in a single visit, with no anesthesia required.",
    faq: baseFAQ,
  },
  "tooth-colored-fillings": {
    intro:
      "Mercury-free, tooth-colored composite fillings that bond directly to your enamel and blend invisibly with your natural teeth. Stronger, healthier, and much better looking than silver amalgam.",
    faq: baseFAQ,
  },
  "dental-crowns": {
    intro:
      "Custom porcelain crowns restore strength and beauty to teeth weakened by large fillings, fractures, or root canals. Crafted to match your existing teeth in shade and shape.",
    process: [
      { title: "Examination", body: "We assess the tooth and take impressions." },
      { title: "Preparation", body: "We shape the tooth and place a temporary crown." },
      { title: "Placement", body: "Your custom crown is bonded for a natural finish." },
    ],
    faq: baseFAQ,
  },
  bridges: {
    intro:
      "A dental bridge replaces one or more missing teeth with a permanent, natural-looking restoration anchored to the teeth on either side of the gap.",
    faq: baseFAQ,
  },
  veneers: {
    intro:
      "Porcelain veneers are thin shells custom-bonded to the front of your teeth to transform their color, shape, and alignment — a dramatic smile makeover in just a few visits.",
    faq: baseFAQ,
  },
  "root-canal": {
    intro:
      "Modern root canal therapy saves infected or severely decayed teeth and ends the pain — often more comfortably than getting a filling. We use gentle, modern techniques to make the process as easy as possible.",
    process: [
      { title: "Diagnosis", body: "We confirm infection and explain your options." },
      { title: "Treatment", body: "Cleaning the canal and sealing the tooth." },
      { title: "Restoration", body: "Typically a crown to fully restore strength." },
    ],
    faq: baseFAQ,
  },
  "deep-cleaning": {
    intro:
      "Scaling and root planing — a deep cleaning below the gumline to remove tartar and bacteria that cause early-stage gum disease. The first line of defense against periodontal disease.",
    faq: baseFAQ,
  },
  "preventative-periodontics": {
    intro:
      "Specialized care to prevent and manage gum disease at every stage. Healthy gums are the foundation of a healthy smile — we'll help you protect them.",
    faq: baseFAQ,
  },
  "night-guards": {
    intro:
      "Custom-fit night guards protect your teeth from the damage of grinding (bruxism) and clenching. More comfortable and effective than store-bought versions.",
    faq: baseFAQ,
  },
  "dental-implants": {
    intro:
      "Dental implants are titanium posts surgically placed into the jawbone to replace the roots of missing teeth. Topped with a custom crown, they look, feel, and function exactly like natural teeth — and they're permanent.",
    benefits: [
      { title: "Permanent solution", body: "Implants can last a lifetime with proper care." },
      { title: "Look and feel natural", body: "No one will know they're not your own." },
      { title: "Preserves bone", body: "Stimulates the jawbone and prevents shrinkage." },
    ],
    process: [
      { title: "Consultation", body: "We assess bone density and plan your treatment." },
      { title: "Implant placement", body: "The titanium post is placed in the jaw." },
      { title: "Osseointegration", body: "The implant fuses with your bone over a few months." },
      { title: "Crown placement", body: "Your custom crown is attached for a complete tooth." },
    ],
    faq: baseFAQ,
  },
  "implant-dentures": {
    intro:
      "Implant-supported dentures snap securely onto a small number of dental implants — eliminating the slipping, sore spots, and adhesive of traditional dentures.",
    faq: baseFAQ,
  },
  dentures: {
    intro:
      "Comfortable, custom dentures that restore your smile, your bite, and your confidence. We craft full and partial dentures that look natural and fit precisely.",
    faq: baseFAQ,
  },
  extractions: {
    intro:
      "When a tooth can't be saved, we provide gentle extractions and thorough aftercare for a smooth recovery. Most extractions are completed in a single visit.",
    faq: baseFAQ,
  },
  "multiple-tooth-extractions": {
    intro:
      "When several teeth need to be removed — whether for full-mouth restoration, dentures, or oral health reasons — we provide coordinated, comfortable care from extraction through recovery.",
    faq: baseFAQ,
  },
};
