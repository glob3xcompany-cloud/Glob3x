import type { Locale } from "./i18n";

export const REEDS_SLUG = "reeds-towers";

/** Primary navigation. `contact` is the header CTA and lives in the footer, not in this list. */
export const NAV = [
  { key: "group", slug: "group" },
  { key: "projects", slug: "projects" },
  { key: "construction", slug: "construction" },
  { key: "reeds", slug: `projects/${REEDS_SLUG}` },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export const href = (locale: Locale, slug?: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);

export const projectHref = (locale: Locale, slug: string) => href(locale, `projects/${slug}`);
