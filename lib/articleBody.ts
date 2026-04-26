import type { Article } from "./articles";

const intro = (a: Article) =>
  `${a.title} is an important topic in dental health. This patient-education resource gives you the background you need to make confident decisions about your care, and it's reviewed by Dr. Raed Ammari and the team at Ammari Dental in Aurora, CO.`;

const overviewByTopic: Record<string, string[]> = {
  Cosmetic: [
    "Cosmetic dentistry covers any procedure that improves the appearance of your teeth, gums, or bite — even when the underlying tooth is healthy. The most common goals are correcting shape, color, alignment, or gaps.",
    "Modern cosmetic options are conservative — meaning they preserve as much of your natural tooth as possible — and they look indistinguishable from your real teeth.",
  ],
  Restorative: [
    "Restorative dentistry repairs or replaces teeth that are damaged, decayed, or missing. The goal is to bring your bite, function, and appearance back to a healthy baseline.",
    "Most restorations today use tooth-colored materials that bond directly to your natural enamel, giving you both strength and aesthetics in a single treatment.",
  ],
  Implants: [
    "Dental implants are titanium posts that replace the root of a missing tooth. Once they fuse with the jawbone, they can support a single crown, a bridge, or even a full set of teeth.",
    "Implants are designed to last a lifetime when cared for properly. They look, feel, and function like natural teeth, and they help preserve the jawbone.",
  ],
  Surgical: [
    "Some dental issues are best treated with a small surgical procedure. Modern techniques mean these visits are usually quick, comfortable, and well-controlled with local anesthesia or sedation.",
    "We plan every surgical case carefully to minimize discomfort and maximize a smooth recovery.",
  ],
  Emergency: [
    "Dental emergencies come on fast — a cracked tooth, a sudden ache, swelling, or trauma. The faster you call, the more options we have to save the tooth and end the pain.",
    "We hold open same-day appointments specifically for emergencies, and we have an after-hours line for urgent issues outside of business hours.",
  ],
  Periodontics: [
    "The health of your gums is the foundation of your whole mouth. Periodontal care prevents and treats gum disease — the leading cause of tooth loss in adults.",
    "Most early gum disease is reversible with proper care, and we tailor every treatment plan to your unique situation.",
  ],
  Hygiene: [
    "Daily home care is the single biggest factor in preventing cavities and gum disease. Done well, brushing and flossing remove plaque before it can do damage.",
    "Pair a strong home routine with two professional cleanings per year, and most patients can keep their natural teeth for life.",
  ],
  Prevention: [
    "Preventive dentistry stops problems before they start. From sealants to night guards to fluoride, the right preventive tools save you money, discomfort, and time in the chair.",
    "We tailor preventive recommendations to your habits, history, and risk profile.",
  ],
  Health: [
    "Your mouth and your overall health are deeply connected. Conditions like diabetes, heart disease, and pregnancy all affect — and are affected by — what's happening in your mouth.",
    "We work alongside your other care providers to keep your dental and medical care aligned.",
  ],
  Orthodontics: [
    "Orthodontic care straightens crooked teeth and corrects bite issues. Whether it's traditional braces or clear aligners, modern orthodontics offers options for almost every age and lifestyle.",
    "A straight bite isn't just about looks — it makes cleaning easier, reduces wear, and protects your jaw joint.",
  ],
  Pediatric: [
    "Children deserve a dental experience that's gentle, fun, and educational. Early visits help kids feel comfortable and build habits that last a lifetime.",
    "We see children from their first tooth through the teen years and beyond.",
  ],
  Education: [
    "Knowing what's going on in your mouth — and why we recommend a particular treatment — makes you a better partner in your own care. We strive to explain every recommendation in plain language.",
    "If anything in this article raises a question, just ask us at your next visit or give us a call.",
  ],
};

const whatToExpect: Record<string, string[]> = {
  Cosmetic: [
    "Most cosmetic visits start with a consultation. We'll talk about what you'd like to change, look at your teeth and bite, and lay out realistic options at a few different levels of investment.",
    "Once you choose a direction, treatment is usually one to a few visits depending on complexity.",
  ],
  Restorative: [
    "After a thorough exam and any needed imaging, we'll discuss your options and the materials involved. Most restorations are completed in one or two visits.",
    "We use local anesthesia as needed to keep treatment comfortable from start to finish.",
  ],
  Implants: [
    "Implant treatment is staged. We start with a planning visit and 3D imaging, place the implant, and then return after a few months of healing to attach the final crown.",
    "Throughout the process we're checking healing and making sure your final result fits perfectly.",
  ],
  Surgical: [
    "We start with a planning conversation, explain everything in detail, and only proceed when you're comfortable. Most surgical visits take less than an hour.",
    "After your procedure, we provide written aftercare instructions and a direct line to call if anything feels off.",
  ],
  Emergency: [
    "When you call, we'll triage the issue over the phone, get you in fast, and stabilize the tooth on day one. Any longer-term restoration we'll plan together at a follow-up.",
  ],
  Periodontics: [
    "We measure pocket depths around each tooth, look for inflammation and bleeding, and use that data to recommend a personalized hygiene approach — anything from a routine cleaning to scaling and root planing.",
  ],
  Hygiene: [
    "A typical hygiene visit includes a professional cleaning, polishing, and a coaching moment if we spot an area that needs more attention at home.",
  ],
  Prevention: [
    "We'll review your home routine, look for early warning signs, and recommend the right preventive treatments — from sealants to night guards — for your situation.",
  ],
  Health: [
    "We coordinate with your physician when needed, and we adjust treatment timing and medications around any underlying health conditions.",
  ],
  Orthodontics: [
    "After an evaluation, we'll talk through which approach makes sense for your goals and timeline. From there, treatment usually involves periodic check-ins to track progress.",
  ],
  Pediatric: [
    "Kids' visits are short, friendly, and focused on building comfort. We use age-appropriate language and let parents stay close.",
  ],
  Education: [
    "If you have questions after reading this, jot them down and bring them to your next visit. We love a good question — it usually means you're paying attention.",
  ],
};

export function buildArticleBody(article: Article) {
  const overview = overviewByTopic[article.topic] ?? overviewByTopic.Education;
  const expect = whatToExpect[article.topic] ?? whatToExpect.Education;

  return [
    { paragraphs: [intro(article)] },
    { heading: "Overview", paragraphs: overview },
    { heading: "What to Expect", paragraphs: expect },
    {
      heading: "Talk to Us",
      paragraphs: [
        `If you'd like to discuss ${article.title.toLowerCase()} with Dr. Ammari and our team, the best next step is to schedule a visit. We'll walk you through your options in person, where we can examine your teeth and answer questions specific to you.`,
      ],
    },
  ];
}
