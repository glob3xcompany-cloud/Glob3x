import type { Locale } from "./i18n";
import type { Project } from "./projects";

export const REEDS_SLUG = "reeds-towers";

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
  // The flagship gets its own entry: it is the project the company leads with.
  { key: "reeds", slug: `projects/${REEDS_SLUG}` },
  { key: "construction", slug: "construction" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export const href = (locale: Locale, slug?: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);

export const projectHref = (locale: Locale, slug: string) => href(locale, `projects/${slug}`);

/** Swap the locale prefix of a localized pathname. */
export const localizedPath = (pathname: string, locale: Locale) => {
  const rest = pathname.replace(/^\/[^/]+(?=\/|$)/, "");
  return `/${locale}${rest}`;
};
