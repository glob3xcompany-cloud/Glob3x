import { generated } from "@/dictionaries/generated";

/**
 * Core locales are written and reviewed by hand (dictionaries/<locale>.json).
 * Additional locales are produced by `npm run translate` (scripts/translate.mjs, DeepL) into
 * dictionaries/generated/ and registered in dictionaries/generated/index.ts. A visitor whose
 * browser language is not available falls back to English.
 */
export const coreLocales = ["sq", "en", "it", "de", "fr", "es"] as const;
export type CoreLocale = (typeof coreLocales)[number];

export const extraLocales: readonly string[] = Object.keys(generated);
export const locales: readonly string[] = [...coreLocales, ...extraLocales];

export type Locale = CoreLocale | (string & {});
export const defaultLocale: Locale = "en";

export function isCoreLocale(value: string | undefined): value is CoreLocale {
  return coreLocales.some((l) => l === value);
}

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && locales.includes(value);
}

/** Native language names for the language menu. Unknown codes fall back to Intl.DisplayNames. */
const NATIVE_NAMES: Record<string, string> = {
  sq: "Shqip",
  en: "English",
  it: "Italiano",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  el: "Ελληνικά",
  tr: "Türkçe",
  ru: "Русский",
  nl: "Nederlands",
  pl: "Polski",
  ro: "Română",
  sv: "Svenska",
  da: "Dansk",
  nb: "Norsk",
  fi: "Suomi",
  cs: "Čeština",
  hu: "Magyar",
  bg: "Български",
  uk: "Українська",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

export function localeName(locale: string): string {
  if (NATIVE_NAMES[locale]) return NATIVE_NAMES[locale];
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;
  } catch {
    return locale;
  }
}

const OG_LOCALES: Record<string, string> = { sq: "sq_AL", en: "en_GB", it: "it_IT", de: "de_DE", fr: "fr_FR", es: "es_ES" };
export const ogLocale = (locale: string) => OG_LOCALES[locale] ?? `${locale.split("-")[0]}_${(locale.split("-")[1] ?? locale).toUpperCase()}`;

/** Right-to-left scripts, so the layout can switch direction for generated locales. */
export const isRtl = (locale: string) => ["ar", "he", "fa", "ur"].includes(locale.split("-")[0]);

/**
 * Pick the best locale from an Accept-Language header: exact tag first (e.g. pt-BR),
 * then the base language, then English.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1, index };
    })
    .filter((r) => r.tag && r.tag !== "*")
    .sort((a, b) => b.q - a.q || a.index - b.index);
  const lower = new Map(locales.map((l) => [l.toLowerCase(), l]));
  for (const { tag } of ranked) {
    const exact = lower.get(tag);
    if (exact) return exact;
  }
  for (const { tag } of ranked) {
    const base = lower.get(tag.split("-")[0]);
    if (base) return base;
  }
  return defaultLocale;
}
