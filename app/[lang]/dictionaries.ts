import { generated } from "@/dictionaries/generated";
import { type CoreLocale, type Locale, isCoreLocale } from "@/lib/i18n";

export type Dictionary = typeof import("@/dictionaries/en.json");
export type ProjectCopy = Dictionary["projects"]["items"][keyof Dictionary["projects"]["items"]];

const core: Record<CoreLocale, () => Promise<Dictionary>> = {
  sq: () => import("@/dictionaries/sq.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  it: () => import("@/dictionaries/it.json").then((m) => m.default),
  de: () => import("@/dictionaries/de.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
};

/** Hand-written core dictionaries first, then machine-translated ones; anything else falls back to English. */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (isCoreLocale(locale)) return core[locale]();
  const extra = generated[locale];
  if (extra) {
    try {
      return await extra();
    } catch {
      // A generated file may be missing or invalid: never break the page for it.
    }
  }
  return core.en();
}

/** Copy for a project by slug. Slugs come from lib/projects.ts and must exist in every dictionary. */
export function projectCopy(dict: Dictionary, slug: string): ProjectCopy {
  const items = dict.projects.items as Record<string, ProjectCopy>;
  const copy = items[slug];
  if (!copy) throw new Error(`Missing dictionary entry projects.items.${slug}`);
  return copy;
}
