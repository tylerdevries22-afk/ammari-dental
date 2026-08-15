import type { Metadata } from "next";
import { site } from "./site";

const base = `${site.name} | Aurora, CO`;

const titleFor = (title: string) =>
  title.includes(site.name) || title.includes("Aurora") ? title : `${title} | ${base}`;

export const pageMeta: Record<string, Metadata> = {
  "/": {
    title: "Ammari Dental | Aurora CO Family & Cosmetic Dentist",
    description:
      "Friendly staff, beautiful smiles, welcoming environment. Family, cosmetic, and emergency dentistry in Aurora, CO. Call (303) 283-8009 to book.",
  },
  "/appointment": {
    title: "Appointment Request - Schedule an Appointment with Ammari Dental",
    description:
      "Request an appointment with Ammari Dental in Aurora, CO. New and existing patients welcome. Most insurance accepted.",
  },
  "/contact": {
    title: titleFor("Contact Us"),
    description:
      "Contact Ammari Dental in Aurora, CO. Call (303) 283-8009 or send a message. 1344 S Chambers Road, Suite 203.",
  },
  "/new-patients": {
    title: titleFor("New Patients"),
    description:
      "Welcome to Ammari Dental. Learn what to expect at your first visit, download forms, and book your new-patient appointment in Aurora, CO.",
  },
  "/-new-patient-forms": {
    title: titleFor("New Patient Forms"),
    description:
      "Download new-patient forms for Ammari Dental in Aurora, CO. Save time at your first visit.",
  },
  "/our-dental-office-location": {
    title: titleFor("Our Dental Office Location"),
    description:
      "Find Ammari Dental at 1344 S Chambers Road, Suite 203, Aurora, CO 80017. Map, directions, and hours.",
  },
  "/dental-staff": {
    title: titleFor("Meet Our Staff"),
    description:
      "Meet the dentist and team at Ammari Dental in Aurora, CO. Friendly, experienced, patient-focused care.",
  },
  "/gallery": {
    title: titleFor("Photo Gallery"),
    description:
      "Tour the Ammari Dental office and see our work. Friendly, modern dental care in Aurora, CO.",
  },
  "/reviews": {
    title: titleFor("Reviews"),
    description:
      "Read patient reviews of Ammari Dental in Aurora, CO. Trusted by families across the Denver metro.",
  },
  "/testimonials": {
    title: titleFor("Testimonials"),
    description:
      "Read what patients say about Ammari Dental. Aurora, CO family and cosmetic dentistry.",
  },
  "/financing": {
    title: titleFor("Financing"),
    description:
      "Flexible payment options at Ammari Dental in Aurora, CO. CareCredit and most major insurance accepted.",
  },
  "/-improving-your-smile": {
    title: titleFor("Improving Your Smile"),
    description:
      "Cosmetic dentistry to help you love your smile. Whitening, veneers, bonding, and more in Aurora, CO.",
  },
  "/-q---a": {
    title: titleFor("Q & A"),
    description:
      "Common questions about visiting Ammari Dental in Aurora, CO. Insurance, scheduling, services, and more.",
  },
  "/educational-videos": {
    title: titleFor("Educational Videos"),
    description:
      "Watch educational videos about dental procedures and oral health at Ammari Dental.",
  },
  "/links": {
    title: titleFor("Helpful Links"),
    description:
      "Helpful dental and oral health resources from Ammari Dental in Aurora, CO.",
  },
  "/privacy": {
    title: titleFor("Privacy Policy"),
    description:
      "Privacy policy for Ammari Dental, Aurora, CO.",
  },
  "/notice-of-non-discrimination": {
    title: titleFor("Notice of Non-Discrimination"),
    description:
      "Ammari Dental's notice of non-discrimination.",
  },
  "/before-anesthesia": {
    title: titleFor("Before Anesthesia"),
    description:
      "Pre-anesthesia instructions for patients at Ammari Dental in Aurora, CO.",
  },
  "/surgical-instructions": {
    title: titleFor("Surgical Instructions"),
    description:
      "Important surgical instructions before and after dental procedures at Ammari Dental.",
  },
  "/after-dental-implant-surgery": {
    title: titleFor("After Dental Implant Surgery"),
    description:
      "Recovery and care instructions after dental implant surgery at Ammari Dental, Aurora CO.",
  },
  "/after-impacted-tooth": {
    title: titleFor("After Impacted Tooth Removal"),
    description:
      "Post-operative care after impacted tooth removal.",
  },
  "/after-wisdom-tooth-removal": {
    title: titleFor("After Wisdom Tooth Removal"),
    description:
      "Care instructions for recovering after wisdom tooth removal.",
  },
  "/post-op-instructions": {
    title: titleFor("Post-Op Instructions"),
    description:
      "Post-operative care instructions for patients of Ammari Dental.",
  },

  // Service pages — preserved title patterns
  "/dental-services": {
    title: "General Dentistry | Aurora, CO Dentist",
    description:
      "Comprehensive general dentistry in Aurora, CO — exams, cleanings, fillings, and preventive care from Dr. Raed Ammari.",
  },
  "/comfortable-dentistry": {
    title: "Comfortable Dentistry | Aurora, CO Dentist",
    description:
      "Gentle, anxiety-aware dental care in Aurora, CO. Comfort options for every patient at Ammari Dental.",
  },
  "/dental-emergencies": {
    title: "Dental Emergencies | Aurora, CO Dentist",
    description:
      "Same-day emergency dental care in Aurora, CO. Broken teeth, pain, swelling — call (303) 283-8009.",
  },
  "/teeth-whitening": {
    title: "Teeth Whitening | Aurora, CO Dentist",
    description:
      "Professional teeth whitening in Aurora, CO. Brighten your smile with safe, effective treatment.",
  },
  "/bonding": {
    title: "Dental Bonding | Aurora, CO Dentist",
    description:
      "Cosmetic dental bonding in Aurora, CO to repair chips, gaps, and discoloration.",
  },
  "/tooth-colored-fillings": {
    title: "Tooth-Colored Fillings | Aurora, CO Dentist",
    description:
      "Natural-looking, mercury-free tooth-colored fillings at Ammari Dental in Aurora, CO.",
  },
  "/dental-crowns": {
    title: "Dental Crowns | Aurora, CO Dentist",
    description:
      "Custom porcelain dental crowns to restore damaged teeth in Aurora, CO.",
  },
  "/bridges": {
    title: "Dental Bridges | Aurora, CO Dentist",
    description:
      "Fixed dental bridges to replace missing teeth in Aurora, CO.",
  },
  "/veneers": {
    title: "Porcelain Veneers | Aurora, CO Dentist",
    description:
      "Transform your smile with custom porcelain veneers at Ammari Dental in Aurora, CO.",
  },
  "/root-canal": {
    title: "Root Canal Therapy | Aurora, CO Dentist",
    description:
      "Gentle, modern root canal therapy in Aurora, CO. Save your tooth and end the pain.",
  },
  "/deep-cleaning": {
    title: "Deep Cleaning | Aurora, CO Dentist",
    description:
      "Scaling and root planing for gum health in Aurora, CO at Ammari Dental.",
  },
  "/preventative-periodontics": {
    title: "Preventative Periodontics | Aurora, CO Dentist",
    description:
      "Periodontal care to prevent and manage gum disease in Aurora, CO.",
  },
  "/night-guards": {
    title: "Night Guards | Aurora, CO Dentist",
    description:
      "Custom night guards to protect your teeth from grinding and clenching.",
  },
  "/dental-implants": {
    title: "Dental Implants | Aurora, CO Dentist",
    description:
      "Permanent dental implants in Aurora, CO. Replace missing teeth with natural-looking results.",
  },
  "/implant-dentures": {
    title: "Implant Dentures | Aurora, CO Dentist",
    description:
      "Stable, secure implant-supported dentures at Ammari Dental in Aurora, CO.",
  },
  "/dentures": {
    title: "Dentures | Aurora, CO Dentist",
    description:
      "Comfortable, custom dentures that restore your smile in Aurora, CO.",
  },
  "/extractions": {
    title: "Tooth Extractions | Aurora, CO Dentist",
    description:
      "Gentle tooth extractions in Aurora, CO with thorough aftercare.",
  },
  "/multiple-tooth-extractions": {
    title: "Multiple Tooth Extractions | Aurora, CO Dentist",
    description:
      "Safe, comfortable multiple-tooth extractions at Ammari Dental in Aurora, CO.",
  },
};

export function metaFor(path: string): Metadata {
  // Every page gets a self-referencing canonical. Previously only the article
  // detail route set one, leaving the homepage, all 18 service pages and the
  // conversion pages with no defense against www/trailing-slash/param variants.
  return { ...(pageMeta[path] ?? { title: base }), alternates: { canonical: path } };
}
