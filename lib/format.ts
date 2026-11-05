import type { Fact, ProgrammeKey } from "./projects";

/**
 * Digit-group and decimal separators for the hand-written locales. Spelled out instead of relying on
 * `Intl.NumberFormat` because browser ICU data is not guaranteed to cover every language (Chrome has no
 * Albanian data and silently falls back to English), which would make server and client output differ.
 * Albanian follows the convention used in the company's documents: 83.576,33 m².
 */
const SEPARATORS: Record<string, { group: string; decimal: string }> = {
  sq: { group: ".", decimal: "," },
  en: { group: ",", decimal: "." },
  it: { group: ".", decimal: "," },
  de: { group: ".", decimal: "," },
  fr: { group: "\u202f", decimal: "," },
  es: { group: ".", decimal: "," },
  pt: { group: ".", decimal: "," },
  nl: { group: ".", decimal: "," },
  el: { group: ".", decimal: "," },
  tr: { group: ".", decimal: "," },
  pl: { group: "\u00a0", decimal: "," },
  ru: { group: "\u00a0", decimal: "," },
  uk: { group: "\u00a0", decimal: "," },
};

const separatorsFor = (locale: string) => SEPARATORS[locale] ?? SEPARATORS[locale.split("-")[0]];

/**
 * Reads an integer written in the locale's convention ("83.576", "83 576", "83,576"). Returns null for
 * anything with a fractional part or that is not a plain number, so callers can render such values verbatim.
 */
export function parseLocaleInteger(locale: string, text: string): number | null {
  const sep = separatorsFor(locale) ?? SEPARATORS.en;
  const groupless = text.split(sep.group).join("").replace(/[\u00a0\u202f ]/g, "");
  if (groupless.includes(sep.decimal) || !/^\d+$/.test(groupless)) return null;
  return Number(groupless);
}

/** Locale-aware number formatting ("83,576.33" / "83.576,33" / "83 576,33"), identical on server and client. */
export function formatNumber(locale: string, n: number, maxFractionDigits = 2): string {
  const sep = separatorsFor(locale);
  if (!sep) {
    try {
      return new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits }).format(n);
    } catch {
      return formatNumber("en", n, maxFractionDigits);
    }
  }
  const rounded = Math.round(Math.abs(n) * 10 ** maxFractionDigits) / 10 ** maxFractionDigits;
  const [int, frac = ""] = rounded.toFixed(maxFractionDigits).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep.group);
  const decimals = frac.replace(/0+$/, "");
  return `${n < 0 ? "−" : ""}${grouped}${decimals ? sep.decimal + decimals : ""}`;
}

export type FactLabels = { programme: Record<ProgrammeKey, string> };

/** Renders a fact value in the visitor's locale. */
export function formatFact(locale: string, fact: Fact, labels: FactLabels): string {
  if (fact.k === "programme") return fact.items.map((i) => labels.programme[i]).join(" · ");
  if ("v" in fact) return fact.v;
  const value = formatNumber(locale, fact.n);
  const unit = fact.unit ? `\u00a0${fact.unit}` : "";
  return `${fact.approx ? "≈ " : ""}${value}${unit}`;
}
