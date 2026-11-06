/** Company-wide contact details. Update here, everything else follows. */
export const site = {
  /** "Glob3x Group" is the company name: it is never translated or shortened in copy. */
  company: "Glob3x Group",
  legalName: "Glob3x Group sh.p.k.",
  /** Public origin, used for canonical URLs, hreflang and the sitemap. */
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://glob3x.com",
  email: "info@glob3x.com",
  /** Sales line (Instagram bio). E.164 without "+", used for the WhatsApp deep link. */
  whatsapp: "355697003218",
  phoneDisplay: "+355 69 700 3218",
  /** Office line published on the current website. */
  officePhone: "+355 69 700 3214",
  address: {
    sq: "Rruga Abdyl Frashëri, EGT Tower, kati 5, Tiranë",
    en: "Rruga Abdyl Frashëri, EGT Tower, 5th floor, Tirana, Albania",
    it: "Rruga Abdyl Frashëri, EGT Tower, 5º piano, Tirana, Albania",
    de: "Rruga Abdyl Frashëri, EGT Tower, 5. Stock, Tirana, Albanien",
    fr: "Rruga Abdyl Frashëri, EGT Tower, 5e étage, Tirana, Albanie",
    es: "Rruga Abdyl Frashëri, EGT Tower, 5.ª planta, Tirana, Albania",
  } as Record<string, string>,
  mapsUrl: "https://maps.google.com/?q=EGT+Tower+Tirana",
  foundingYear: 2008,
  /** Only verified profiles. */
  social: [{ name: "Instagram", url: "https://www.instagram.com/glob3xgroup/" }],
  /** Dedicated Reeds Towers site, served as a section of this domain. Override with NEXT_PUBLIC_REEDS_URL in dev. */
  reedsSite: process.env.NEXT_PUBLIC_REEDS_URL ?? "/reeds",
  salesAgents: [
    { name: "Mariglen Shkambi", phone: "+355 69 205 0747" },
    { name: "Emiljana Ndreka", phone: "+355 69 700 3214" },
    { name: "Leonora Beharaj", phone: "+355 69 393 2245" },
    { name: "Greta Basha", phone: "+355 69 739 5020" },
  ],
} as const;

export const siteAddress = (locale: string) => site.address[locale] ?? site.address.en;

export const whatsappUrl = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, "")}`;
