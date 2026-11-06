import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "contact", (await getDictionary(locale)).contact.meta);
}

export default async function ContactPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.contact;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/lobby.webp" />

      <section className="bg-ink text-paper">
        <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ContactForm dict={t} locale={locale} whatsappHref={whatsappUrl(t.whatsappText)} />
          </Reveal>

          <aside className="grid content-start gap-6 lg:col-span-4 lg:col-start-9">
            <Reveal delay={150} className="border border-line-dark bg-ink-2 p-8">
              <p className="eyebrow text-gold">{t.pricing.eyebrow}</p>
              <p className="font-display mt-4 text-4xl">{t.pricing.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/60">{t.pricing.body}</p>
              <Link
                href={`${href(locale, "residences")}#pricing`}
                className="mt-6 inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.18em] text-gold uppercase hover:text-paper"
              >
                {t.pricing.link} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>

            <Reveal delay={250} className="border-t border-line-dark pt-8 text-sm text-paper/70">
              <p className="eyebrow text-paper/50">{t.office}</p>
              <address className="mt-4 grid gap-2 not-italic">
                <span className="text-paper">{site.company}</span>
                <span>{site.address}</span>
                <a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a>
                <a href={`tel:+${site.whatsapp}`} className="hover:text-paper">{site.phoneDisplay}</a>
              </address>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
