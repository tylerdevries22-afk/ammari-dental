export type ServiceKey =
  | "dental-services"
  | "comfortable-dentistry"
  | "dental-emergencies"
  | "teeth-whitening"
  | "bonding"
  | "tooth-colored-fillings"
  | "dental-crowns"
  | "bridges"
  | "veneers"
  | "root-canal"
  | "deep-cleaning"
  | "preventative-periodontics"
  | "night-guards"
  | "dental-implants"
  | "implant-dentures"
  | "dentures"
  | "extractions"
  | "multiple-tooth-extractions";

export type Transformation = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Aspect ratio CSS string for the slider — default "4 / 3". Use "16 / 9" for wider scene shots. */
  aspect?: string;
};

export type Service = {
  slug: ServiceKey;
  name: string;
  h1: string;
  category: "general" | "cosmetic" | "restorative" | "surgical" | "emergency";
  blurb: string;
  icon: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  transformation?: Transformation;
};

export const services: Service[] = [
  {
    slug: "dental-services",
    name: "General Dentistry",
    h1: "Dental Services",
    category: "general",
    blurb:
      "Routine exams, cleanings, and preventive care to keep your smile healthy for life.",
    icon: "tooth-leaf",
    featured: true,
    image: "/images/generated/patient-calm-chair.webp",
    imageAlt: "Patient relaxed in a modern dental operatory at Ammari Dental",
  },
  {
    slug: "comfortable-dentistry",
    name: "Comfortable Dentistry",
    h1: "Comfortable Dentistry",
    category: "general",
    blurb:
      "Gentle, anxiety-aware care designed for patients who want a calm, relaxed experience.",
    icon: "tooth-heart",
    image: "/images/generated/reception-interior.webp",
    imageAlt: "Calm, welcoming reception and waiting area at Ammari Dental",
  },
  {
    slug: "dental-emergencies",
    name: "Dental Emergencies",
    h1: "Dental Emergencies",
    category: "emergency",
    blurb:
      "Same-day urgent care for broken teeth, pain, swelling, and trauma.",
    icon: "tooth-crack",
    featured: true,
    image: "/images/practice/dentist-poster.webp",
    imageAlt: "Dentist providing prompt same-day emergency dental care at Ammari Dental",
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    h1: "Teeth Whitening",
    category: "cosmetic",
    blurb:
      "Professional whitening that delivers a brighter, natural-looking smile.",
    icon: "tooth-sparkle",
    featured: true,
    image: "/images/generated/whitening-smile-hero.webp",
    imageAlt: "Confident woman smiling with brilliantly white teeth after professional whitening at Ammari Dental",
    transformation: {
      beforeSrc: "/images/generated/whitening-before.webp",
      afterSrc: "/images/generated/whitening-after.webp",
      beforeAlt: "Close-up of teeth before professional whitening treatment",
      afterAlt: "Close-up of brilliantly white teeth after professional whitening treatment",
    },
  },
  {
    slug: "bonding",
    name: "Bonding",
    h1: "Bonding",
    category: "cosmetic",
    blurb:
      "Reshape chips, gaps, and discoloration with tooth-colored composite resin.",
    icon: "tooth-brush",
    image: "/images/generated/bonding-after.webp",
    imageAlt: "Close-up of a confident smile after seamless cosmetic dental bonding repair",
    transformation: {
      beforeSrc: "/images/generated/bonding-before.webp",
      afterSrc: "/images/generated/bonding-after.webp",
      beforeAlt: "Close-up of front tooth with a small chip before cosmetic bonding repair",
      afterAlt: "Close-up of the same front tooth seamlessly restored after cosmetic bonding",
    },
  },
  {
    slug: "tooth-colored-fillings",
    name: "Tooth-Colored Fillings",
    h1: "Tooth-Colored Fillings",
    category: "restorative",
    blurb:
      "Mercury-free, natural-looking composite fillings that blend with your enamel.",
    icon: "tooth-fill",
    image: "/images/generated/fillings-hero.webp",
    imageAlt: "Close-up of a natural-looking smile restored with tooth-colored composite fillings",
  },
  {
    slug: "dental-crowns",
    name: "Dental Crowns",
    h1: "Dental Crowns",
    category: "restorative",
    blurb:
      "Custom porcelain crowns that restore strength and beauty to damaged teeth.",
    icon: "crown",
    image: "/images/generated/crowns-after.webp",
    imageAlt: "Confident smile restored with natural-looking porcelain dental crowns at Ammari Dental",
    transformation: {
      beforeSrc: "/images/generated/crowns-before.webp",
      afterSrc: "/images/generated/crowns-after.webp",
      beforeAlt: "Smile with a visibly missing or damaged front tooth before a porcelain crown restoration",
      afterAlt: "The same smile fully restored with a seamless porcelain crown",
      aspect: "16 / 9",
    },
  },
  {
    slug: "bridges",
    name: "Bridges",
    h1: "Bridges",
    category: "restorative",
    blurb:
      "Replace missing teeth with a fixed, natural-looking dental bridge.",
    icon: "bridge",
    image: "/images/generated/bridges-hero.webp",
    imageAlt: "Confident, complete smile restored with a fixed dental bridge",
  },
  {
    slug: "veneers",
    name: "Veneers",
    h1: "Veneers",
    category: "cosmetic",
    blurb:
      "Thin porcelain shells that transform your smile in just a few visits.",
    icon: "tooth-shell",
    image: "/images/generated/veneers-smile-hero.webp",
    imageAlt: "Confident smile transformed by premium porcelain veneers",
    transformation: {
      beforeSrc: "/images/generated/veneers-before.webp",
      afterSrc: "/images/generated/veneers-after.webp",
      beforeAlt: "Close-up of yellowed, gapped, and uneven natural front teeth before porcelain veneers",
      afterAlt: "Close-up of a bright, even, natural-white smile after porcelain veneers",
    },
  },
  {
    slug: "root-canal",
    name: "Root Canal",
    h1: "Root Canal",
    category: "restorative",
    blurb:
      "Save infected teeth and end the pain with modern, gentle endodontic care.",
    icon: "tooth-root",
    featured: true,
    image: "/images/generated/operatory-endodontic.webp",
    imageAlt: "Modern endodontic operatory with advanced equipment at Ammari Dental",
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    h1: "Deep Cleaning",
    category: "general",
    blurb:
      "Scaling and root planing to treat early gum disease and restore gum health.",
    icon: "tooth-water",
    image: "/images/generated/deep-cleaning-hero.webp",
    imageAlt: "Hygienist using an ultrasonic scaler for a deep dental cleaning",
  },
  {
    slug: "preventative-periodontics",
    name: "Preventative Periodontics",
    h1: "Preventative Periodontics",
    category: "general",
    blurb:
      "Specialized care to prevent and manage gum disease at every stage.",
    icon: "tooth-shield",
    image: "/images/generated/perio-hero.webp",
    imageAlt: "Dentist examining healthy gums during a periodontal check-up",
  },
  {
    slug: "night-guards",
    name: "Night Guards",
    h1: "Night Guards",
    category: "general",
    blurb:
      "Custom-fit guards that protect your teeth from grinding and clenching.",
    icon: "tooth-moon",
    image: "/images/generated/night-guard-hero.webp",
    imageAlt: "Clear custom night guard resting on a soft towel in warm light",
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    h1: "Dental Implants",
    category: "surgical",
    blurb:
      "Permanent titanium tooth replacements that look, feel, and function like natural teeth.",
    icon: "implant",
    featured: true,
    image: "/images/generated/implant-smile-hero.webp",
    imageAlt: "Confident smile after a seamless dental implant restoration at Ammari Dental",
    transformation: {
      beforeSrc: "/images/generated/implant-before.webp",
      afterSrc: "/images/generated/implant-smile-hero.webp",
      beforeAlt: "Smile with a visible missing upper front tooth before dental implant placement",
      afterAlt: "The same smile fully restored with a seamless dental implant",
    },
  },
  {
    slug: "implant-dentures",
    name: "Implant Dentures",
    h1: "Implant Dentures",
    category: "surgical",
    blurb:
      "Stable, secure dentures anchored on dental implants — no slipping, no adhesives.",
    icon: "implant-row",
    image: "/images/generated/implant-dentures-hero.webp",
    imageAlt: "Implant-supported overdenture resting on its titanium implant abutments",
  },
  {
    slug: "dentures",
    name: "Dentures",
    h1: "Dentures",
    category: "restorative",
    blurb:
      "Comfortable, custom dentures that restore your smile and confidence.",
    icon: "dentures",
    featured: true,
    image: "/images/generated/dentures-smile-hero.webp",
    imageAlt: "Confident senior woman smiling with natural-looking custom dentures",
  },
  {
    slug: "extractions",
    name: "Extractions",
    h1: "Extractions",
    category: "surgical",
    blurb:
      "Gentle tooth removal with thorough aftercare for a smooth recovery.",
    icon: "forceps",
    image: "/images/generated/extractions-hero.webp",
    imageAlt: "Calm modern operatory with sterile instruments prepared for a gentle tooth extraction",
  },
  {
    slug: "multiple-tooth-extractions",
    name: "Multiple Tooth Extractions",
    h1: "Multiple Tooth Extractions",
    category: "surgical",
    blurb:
      "Coordinated care for patients needing several extractions safely and comfortably.",
    icon: "forceps-multi",
    image: "/images/generated/multiple-extractions-hero.webp",
    imageAlt: "Dentist reviewing a panoramic X-ray with a patient to plan multiple extractions",
  },
];

export const featuredServices = services.filter((s) => s.featured);

export type ServiceCategory = Service["category"];

/** Display label + menu order for each service category. */
export const categoryMeta: Record<ServiceCategory, { label: string; order: number }> = {
  general:     { label: "General & Preventive", order: 1 },
  cosmetic:    { label: "Cosmetic",             order: 2 },
  restorative: { label: "Restorative",          order: 3 },
  surgical:    { label: "Oral Surgery",         order: 4 },
  emergency:   { label: "Emergency",            order: 5 },
};

/** Services grouped by category, in menu order (empty groups dropped). */
export function servicesByCategory(): {
  category: ServiceCategory;
  label: string;
  items: Service[];
}[] {
  return (Object.keys(categoryMeta) as ServiceCategory[])
    .sort((a, b) => categoryMeta[a].order - categoryMeta[b].order)
    .map((category) => ({
      category,
      label: categoryMeta[category].label,
      items: services.filter((s) => s.category === category),
    }))
    .filter((g) => g.items.length > 0);
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function relatedServices(slug: string, count = 3): Service[] {
  const me = getService(slug);
  if (!me) return services.slice(0, count);
  return services
    .filter((s) => s.slug !== slug && s.category === me.category)
    .concat(services.filter((s) => s.category !== me.category && s.slug !== slug))
    .slice(0, count);
}
