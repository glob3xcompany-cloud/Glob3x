import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { projectPath } from "@/lib/routes";
import { site } from "@/lib/site";

const PROJECT_PAGES = PROJECTS.map((p) => projectPath(p.slug));
const PAGES = ["", "group", "projects", "towers", "construction", "contact", "privacy", ...PROJECT_PAGES];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: string, slug: string) => `${site.domain}/${locale}${slug ? `/${slug}` : ""}`;
  const lastModified = new Date();
  return PAGES.map((slug) => ({
    url: url("en", slug),
    lastModified,
    changeFrequency: PROJECT_PAGES.includes(slug) ? "monthly" : "weekly",
    priority: slug === "" ? 1 : PROJECT_PAGES.includes(slug) || slug === "projects" || slug === "towers" ? 0.8 : 0.6,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, slug)])) },
  }));
}
