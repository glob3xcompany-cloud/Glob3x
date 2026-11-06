import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { NAV } from "@/lib/routes";
import { BASE_PATH, site } from "@/lib/site";

const PAGES = ["", ...NAV.map((item) => item.slug)];

/** Served at /reeds/sitemap.xml and referenced from the group robots.txt. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: string, slug: string) => `${site.groupSite}${BASE_PATH}/${locale}${slug ? `/${slug}` : ""}`;
  const lastModified = new Date();
  return PAGES.map((slug) => ({
    url: url("en", slug),
    lastModified,
    changeFrequency: "weekly",
    priority: slug === "" ? 0.9 : 0.7,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, slug)])) },
  }));
}
