import { cacheLife } from "next/cache";
import Link from "next/link";
import { type Locale, localeName, locales } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import { NAV, href, projectHref } from "@/lib/routes";
import { site, siteAddress, telHref } from "@/lib/site";
import { BrandLogo } from "./brand-logo";

type FooterDict = {
  tagline: string;
  navigation: string;
  projects: string;
  contact: string;
  language: string;
  disclaimer: string;
  rights: string;
};
type NavDict = Record<(typeof NAV)[number]["key"], string> & { contact: string };
type ProjectNames = Record<string, { name: string }>;

async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ dict, nav, names, locale }: { dict: FooterDict; nav: NavDict; names: ProjectNames; locale: Locale }) {
  const year = await getYear();
  return (
    <footer className="border-t border-line-dark bg-navy text-paper">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <BrandLogo size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">{dict.tagline}</p>
            <div className="mt-6 flex gap-4 text-sm">
              {site.social.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="hover:text-gold">
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-paper/50">{dict.navigation}</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link href={href(locale, item.slug)} className="hover:text-gold">{nav[item.key]}</Link>
                </li>
              ))}
              <li>
                <Link href={href(locale, "contact")} className="hover:text-gold">{nav.contact}</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-paper/50">{dict.projects}</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {PROJECTS.map((p) => (
                <li key={p.slug}>
                  <Link href={projectHref(locale, p.slug)} className="hover:text-gold">{names[p.slug]?.name ?? p.slug}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-paper/50">{dict.contact}</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
              </li>
              <li>
                <a href={telHref(site.phoneDisplay)} className="hover:text-gold">{site.phoneDisplay}</a>
              </li>
              <li className="text-paper/70">{siteAddress(locale)}</li>
            </ul>
            <p className="eyebrow mt-8 text-paper/50">{dict.language}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {locales.map((l) => (
                <li key={l}>
                  <Link href={href(l)} hrefLang={l} lang={l} className={l === locale ? "text-gold" : "hover:text-gold"}>
                    {localeName(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 max-w-3xl text-[0.75rem] leading-relaxed text-paper/45">{dict.disclaimer}</p>
        <p className="mt-4 text-[0.75rem] text-paper/45">
          © {year} {site.legalName} · {dict.rights}
        </p>
      </div>
    </footer>
  );
}
