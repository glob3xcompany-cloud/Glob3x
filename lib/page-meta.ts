import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { BASE_PATH } from "./site";

/**
 * Per-page metadata with canonical + hreflang alternates. `metadataBase` is the group origin, so the
 * paths below carry BASE_PATH explicitly: Next does not add `basePath` to metadata URLs.
 */
export function pageMeta(locale: Locale, slug: string | undefined, meta: { title: string; description: string }): Metadata {
  const path = (l: Locale) => `${BASE_PATH}/${l}${slug ? `/${slug}` : ""}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path(locale),
      languages: { en: path("en"), sq: path("sq"), "x-default": path("en") },
    },
    openGraph: { title: meta.title, description: meta.description, url: path(locale) },
  };
}
