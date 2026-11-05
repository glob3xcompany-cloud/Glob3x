import type { Metadata } from "next";
import { type Locale, locales } from "./i18n";

/** Per-page metadata with canonical + hreflang alternates for every available locale. */
export function pageMeta(
  locale: Locale,
  slug: string | undefined,
  meta: { title: string; description: string },
  image?: string,
): Metadata {
  const path = (l: string) => (slug ? `/${l}/${slug}` : `/${l}`);
  return {
    // The layout appends "| Glob3x Group"; titles that already name the company are used as-is.
    title: meta.title.includes("Glob3x") ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: path(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, path(l)])), "x-default": path("en") },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
