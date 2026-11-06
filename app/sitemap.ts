import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { site } from "@/lib/site";

const PAGES = ["", "group", "projects", "towers", "construction", "contact", ...PROJECTS.map((p) => `projects/${p.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: string, slug: string) => `${site.domain}/${locale}${slug ? `/${slug}` : ""}`;
  const lastModified = new Date();
  return PAGES.map((slug) => ({
    url: url("en", slug),
    lastModified,
    changeFrequency: slug.startsWith("projects/") ? "monthly" : "weekly",
    priority: slug === "" ? 1 : slug.startsWith("projects") || slug === "towers" ? 0.8 : 0.6,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, slug)])) },
  }));
}
