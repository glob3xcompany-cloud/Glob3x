import type { Metadata } from "next";
import type { Locale } from "./i18n";

/** Per-page metadata with canonical + hreflang alternates. */
export function pageMeta(
  locale: Locale,
  slug: string | undefined,
  meta: { title: string; description: string },
  image?: string,
): Metadata {
  const path = (l: Locale) => (slug ? `/${l}/${slug}` : `/${l}`);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path(locale),
      languages: { en: path("en"), sq: path("sq"), "x-default": path("en") },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
