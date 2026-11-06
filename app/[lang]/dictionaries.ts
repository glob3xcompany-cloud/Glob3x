import type { Locale } from "@/lib/i18n";

export type Dictionary = typeof import("@/dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  sq: () => import("@/dictionaries/sq.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
