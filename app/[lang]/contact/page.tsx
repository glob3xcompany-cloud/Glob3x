import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Suspense } from "react";
import { Agents } from "@/components/agents";
import { ContactForm } from "@/components/contact-form";
import { ContactFormWithQuery } from "@/components/contact-form-with-query";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { site, telHref, whatsappUrl } from "@/lib/site";
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
  const whatsappHref = whatsappUrl(t.whatsappText);

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/group/reeds-plaza-street.webp" position="object-[50%_40%]" />

      <section id="form" className="bg-ink text-paper">
        <div className="grid lg:grid-cols-12">
          <div className="container-x py-20 md:py-28 lg:col-span-7 lg:max-w-none lg:pr-16">
            <Reveal className="lg:max-w-2xl">
              <Suspense fallback={<ContactForm dict={t} locale={locale} whatsappHref={whatsappHref} />}>
                <ContactFormWithQuery dict={t} locale={locale} whatsappHref={whatsappHref} />
              </Suspense>
            </Reveal>
            <Reveal delay={200} className="mt-14 grid gap-8 border-t border-line-dark pt-10 text-sm sm:grid-cols-2">
              <div className="grid gap-2 text-paper/70">
                <p className="eyebrow text-paper/50">{t.office}</p>
                <a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a>
                <a href={telHref(site.phoneDisplay)} className="hover:text-paper">{site.phoneDisplay}</a>
                <a href={telHref(site.officePhone)} className="hover:text-paper">{site.officePhone}</a>
                <span>{site.address[locale]}</span>
                <span className="text-paper/50">{t.hours}</span>
                <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-gold uppercase">
                  {t.directions} →
                </a>
              </div>
              <div className="grid gap-2 text-paper/70">
                <p className="eyebrow text-paper/50">{t.skelaTitle}</p>
                {site.skelaFlex.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="hover:text-paper">{p}</a>
                ))}
                <a href={`mailto:${site.skelaFlex.email}`} className="hover:text-paper">{site.skelaFlex.email}</a>
                <span>{site.skelaFlex.address}</span>
              </div>
            </Reveal>
          </div>
          <div className="relative min-h-[20rem] lg:col-span-5">
            <ParallaxImage src="/media/projects/reeds-towers/atrium.webp" alt="" sizes="(min-width: 1024px) 42vw, 100vw" className="h-full min-h-[20rem]" strength={6} />
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.hero.eyebrow} title={t.agentsTitle} body={t.agentsBody} />
          <div className="mt-14 border border-line bg-line">
            <Agents whatsappLabel={dict.common.whatsapp} callLabel={dict.common.call} />
          </div>
        </div>
      </section>
    </>
  );
}
