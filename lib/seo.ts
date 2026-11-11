import { type Locale, coreLocales } from "./i18n";
import type { Project } from "./projects";
import { site, siteAddress } from "./site";

/**
 * Structured data. Google reads these graphs to understand who Glob3x Group is, where it works and
 * what each project is, which is what makes the company eligible for the brand panel and for
 * "construction company in Tirana" style queries.
 */

const url = (path = "") => `${site.domain}${path}`;

const postalAddress = (locale: Locale) => ({
  "@type": "PostalAddress",
  streetAddress: siteAddress(locale).split(",").slice(0, 2).join(",").trim(),
  addressLocality: "Tirana",
  addressRegion: "Tiranë",
  addressCountry: "AL",
});

export const ORGANIZATION_ID = url("/#organization");

export function organizationJsonLd(locale: Locale, knowsAbout: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "GeneralContractor"],
    "@id": ORGANIZATION_ID,
    name: site.company,
    legalName: site.legalName,
    // Every spelling people search for, including the name in the business register ("GLOB 3X GROUP", formerly "GLOB-3X").
    alternateName: ["Glob3x", "Glob 3X", "GLOB 3X GROUP", "Glob 3X Group", "GLOB-3X", "Glob3x Group sh.p.k.", "Glob3x Construction", "Glob3x Real Estate"],
    // NIPT in the Albanian business register (QKB).
    taxID: "K82221013D",
    url: url(`/${locale}`),
    logo: url("/icon.png"),
    image: url("/media/projects/reeds-towers/hero-poster.jpg"),
    email: site.email,
    telephone: site.phoneDisplay,
    foundingDate: String(site.foundingYear),
    address: postalAddress(locale),
    hasMap: site.mapsUrl,
    areaServed: [
      { "@type": "Country", name: "Albania" },
      { "@type": "City", name: "Tirana" },
    ],
    knowsLanguage: [...coreLocales],
    knowsAbout,
    sameAs: site.social.map((s) => s.url),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.phoneDisplay,
        email: site.email,
        availableLanguage: [...coreLocales],
        areaServed: "AL",
      },
    ],
  };
}

export function websiteJsonLd(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": url("/#website"),
    url: url(`/${locale}`),
    name,
    description,
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** `trail` is ordered from the home page onwards; the last item is the current page. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

const PROJECT_TYPE: Record<Project["sector"], string> = {
  towers: "ApartmentComplex",
  residences: "ApartmentComplex",
  hospitality: "Place",
  construction: "Place",
};

export function projectJsonLd(
  project: Project,
  copy: { name: string; intro: string; kicker: string },
  locale: Locale,
  path: string,
) {
  const gfa = project.facts.find((f) => f.k === "gfa" && "n" in f);
  const units = project.facts.find((f) => f.k === "units" && "n" in f);
  return {
    "@context": "https://schema.org",
    "@type": project.type === "hotel" ? "Hotel" : PROJECT_TYPE[project.sector],
    name: copy.name,
    description: copy.intro,
    url: url(path),
    image: url(project.hero.src),
    address: { ...postalAddress(locale), streetAddress: copy.kicker.split("·")[0].trim() },
    ...(gfa && "n" in gfa ? { floorSize: { "@type": "QuantitativeValue", value: gfa.n, unitCode: "MTK" } } : {}),
    ...(units && "n" in units ? { numberOfAccommodationUnits: { "@type": "QuantitativeValue", value: units.n } } : {}),
    ...(project.role === "contractor" ? {} : { developer: { "@id": ORGANIZATION_ID } }),
  };
}
