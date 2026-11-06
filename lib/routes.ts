import type { Locale } from "./i18n";

export const NAV = [
  { key: "architecture", slug: "architecture" },
  { key: "towers", slug: "towers" },
  { key: "residences", slug: "residences" },
  { key: "units", slug: "units" },
  { key: "company", slug: "company" },
  { key: "location", slug: "location" },
  { key: "contact", slug: "contact" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export const href = (locale: Locale, slug?: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);
