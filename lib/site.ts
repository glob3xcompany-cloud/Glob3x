/** Company-wide contact details. Update here, everything else follows. */
export const site = {
  company: "Glob 3X Group",
  legalName: "Glob 3X Group sh.p.k.",
  domain: "https://glob3x.al",
  email: "info@glob3x.al",
  /** Sales line (Instagram bio). E.164 without "+", used for the WhatsApp deep link. */
  whatsapp: "355697003218",
  phoneDisplay: "+355 69 700 3218",
  /** Office line published on the current website. */
  officePhone: "+355 69 700 3214",
  address: {
    en: "Rruga Abdyl Frashëri, EGT Tower, 5th floor, Tirana, Albania",
    sq: "Rruga Abdyl Frashëri, EGT Tower, kati 5, Tiranë",
  },
  mapsUrl: "https://maps.google.com/?q=EGT+Tower+Tirana",
  foundingYear: 2008,
  /** Only verified profiles. */
  social: [{ name: "Instagram", url: "https://www.instagram.com/glob3xgroup/" }],
  partners: {
    coldefy: "https://coldefy.fr",
    artech: "https://artech.al",
    sempervirens: "https://sempervirens.fr",
  },
  /** Dedicated Reeds Towers microsite (set NEXT_PUBLIC_REEDS_URL in production). */
  reedsSite: process.env.NEXT_PUBLIC_REEDS_URL ?? "http://localhost:3000",
  skelaFlex: {
    phones: ["+355 69 608 6886", "+355 69 401 1207"],
    email: "flexskela@gmail.com",
    instagram: "https://www.instagram.com/skelaflex/",
    address: "Rruga Besa, Tirana",
  },
  salesAgents: [
    { name: "Mariglen Shkambi", phone: "+355 69 205 0747" },
    { name: "Emiljana Ndreka", phone: "+355 69 700 3214" },
    { name: "Leonora Beharaj", phone: "+355 69 393 2245" },
    { name: "Greta Basha", phone: "+355 69 739 5020" },
  ],
} as const;

export const whatsappUrl = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, "")}`;
