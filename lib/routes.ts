import type { Locale } from "./i18n";
import type { Project } from "./projects";
import { site } from "./site";

export const REEDS_SLUG = "reeds-towers";
/** The Reeds Towers project page sits in the Towers section; the Reeds nav entry opens the dedicated site instead. */
export const REEDS_PAGE = `towers/${REEDS_SLUG}`;

/** Reeds Towers has a dedicated site of its own, served as a section of this domain. */
export const reedsSiteHref = (base: string, locale: Locale, slug?: string) => `${base}/${locale === "sq" ? "sq" : "en"}${slug ? `/${slug}` : ""}`;

/** Index into contact.interestOptions for a project, so the contact form preselection follows the locale. */
export function interestIndex(project: Project): number {
  if (project.slug === REEDS_SLUG) return 2;
  if (project.sector === "towers") return 3;
  if (project.sector === "hospitality") return 4;
  if (project.sector === "construction") return 5;
  if (project.slug === "new-corner-residence") return 1;
  return 0;
}

/** Primary navigation, in order. `contact` is the header CTA and lives in the footer, not in this list. */
export const NAV = [
  { key: "home", slug: "" },
  { key: "group", slug: "group" },
  { key: "projects", slug: "projects" },
  { key: "towers", slug: "towers" },
  // The flagship gets its own entry, which opens the dedicated Reeds Towers site served at /reeds.
  { key: "reeds", slug: "", external: true },
  { key: "construction", slug: "construction" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];
export type NavItem = (typeof NAV)[number];

export const href = (locale: Locale, slug?: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);

/** External entries live in another app on this domain, so they need a plain <a>, not next/link. */
export const isExternalNav = (item: NavItem) => "external" in item && item.external;
export const navHref = (locale: Locale, item: NavItem) => (isExternalNav(item) ? reedsSiteHref(site.reedsSite, locale) : href(locale, item.slug));

export const projectPath = (slug: string) => (slug === REEDS_SLUG ? REEDS_PAGE : `projects/${slug}`);
export const projectHref = (locale: Locale, slug: string) => href(locale, projectPath(slug));

/** Swap the locale prefix of a localized pathname. */
export const localizedPath = (pathname: string, locale: Locale) => {
  const rest = pathname.replace(/^\/[^/]+(?=\/|$)/, "");
  return `/${locale}${rest}`;
};
