import { cacheLife } from "next/cache";
import Link from "next/link";
import { trackingEnabled } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { NAV, href } from "@/lib/routes";
import { privacyUrl, site } from "@/lib/site";
import { ConsentSettingsButton } from "./consent-banner";

type FooterDict = {
  developer: string;
  group: string;
  contactLabel: string;
  navigation: string;
  disclaimer: string;
  rights: string;
  language: string;
  privacy: string;
};
type NavDict = Record<(typeof NAV)[number]["key"], string> & { home: string };

async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ dict, cookies, nav, locale }: { dict: FooterDict; cookies: { settings: string }; nav: NavDict; locale: Locale }) {
  const year = await getYear();
  return (
    <footer className="border-t border-line-dark bg-ink-2 text-paper">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl tracking-[0.18em] uppercase">Reeds Towers</p>
            <p className="mt-3 text-sm text-paper/60">Rruga e Kavajës · Tirana</p>
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
            <ul className="mt-3 grid gap-2 text-sm">
              <li><Link href={href(locale)} className="hover:text-gold">{nav.home}</Link></li>
              {NAV.map((item) => (
                <li key={item.slug}>
                  <Link href={href(locale, item.slug)} className="hover:text-gold">{nav[item.key]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-2 gap-8 md:col-span-4 md:grid-cols-3">
            <div>
              <dt className="eyebrow text-paper/50">{dict.developer}</dt>
              <dd className="mt-2 text-sm">
                <Link href={href(locale, "company")} className="hover:text-gold">{site.company}</Link>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/50">{dict.group}</dt>
              <dd className="mt-2 text-sm">
                <a href={site.groupSite} className="hover:text-gold">
                  glob3x.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/50">{dict.contactLabel}</dt>
              <dd className="mt-2 text-sm">
                <a href={`mailto:${site.email}`} className="hover:text-gold">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>

          <div className="md:col-span-2 md:text-right">
            <p className="eyebrow text-paper/50">{dict.language}</p>
            <div className="mt-2 flex gap-4 text-sm md:justify-end">
              <Link href="/en" hrefLang="en" className={locale === "en" ? "text-gold" : "hover:text-gold"}>English</Link>
              <Link href="/sq" hrefLang="sq" className={locale === "sq" ? "text-gold" : "hover:text-gold"}>Shqip</Link>
            </div>
          </div>
        </div>
        <p className="mt-12 max-w-3xl text-[0.75rem] leading-relaxed text-paper/45">{dict.disclaimer}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.75rem] text-paper/45">
          <p>
            © {year} {site.company}. {dict.rights}
          </p>
          <a href={privacyUrl(locale)} className="hover:text-gold">{dict.privacy}</a>
          {trackingEnabled ? <ConsentSettingsButton label={cookies.settings} /> : null}
        </div>
      </div>
    </footer>
  );
}
