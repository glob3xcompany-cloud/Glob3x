import type { Locale } from "@/lib/i18n";

export type Dictionary = typeof import("@/dictionaries/en.json");
export type ProjectCopy = Dictionary["projects"]["items"][keyof Dictionary["projects"]["items"]];

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  sq: () => import("@/dictionaries/sq.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();

/** Copy for a project by slug. Slugs come from lib/projects.ts and are guaranteed to exist in both dictionaries. */
export function projectCopy(dict: Dictionary, slug: string): ProjectCopy {
  const items = dict.projects.items as Record<string, ProjectCopy>;
  const copy = items[slug];
  if (!copy) throw new Error(`Missing dictionary entry projects.items.${slug}`);
  return copy;
}
