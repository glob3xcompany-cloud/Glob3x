/** Company-wide contact details. Update here, everything else follows. */
export const site = {
  /** "Glob3x Group" is the company name: it is never translated or shortened in copy. */
  company: "Glob3x Group",
  email: "info@glob3x.com",
  /** Sales office (Instagram bio). E.164 without "+", used for the WhatsApp deep link. */
  whatsapp: "355697003218",
  phoneDisplay: "+355 69 700 3218",
  address: "EGT Tower, 5th floor, Tirana, Albania",
  /** Public origin of the group website; this microsite is served from BASE_PATH underneath it. */
  groupSite: process.env.NEXT_PUBLIC_GROUP_URL ?? "https://glob3x.com",
  /** Only verified profiles. Add LinkedIn / Facebook / YouTube once the official URLs are confirmed. */
  social: [{ name: "Instagram", url: "https://www.instagram.com/glob3xgroup/" }],
} as const;

/** Mirrors `basePath` in next.config.ts. Links use <Link>, which adds it automatically; metadata does not. */
export const BASE_PATH = "/reeds";

/**
 * Public URL of a file in /public. Next adds `basePath` to <Link> and to its own chunks, but NOT to
 * <Image src>, <video src> or <source src>, so a bare "/media/…" path 404s once the site is served
 * under /reeds. Every media path goes through here; it is idempotent so prefixed or absolute URLs pass.
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const whatsappUrl = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
