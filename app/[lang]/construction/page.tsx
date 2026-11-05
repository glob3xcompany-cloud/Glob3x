import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { Gallery } from "@/components/gallery";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { projectHref } from "@/lib/routes";
import { site, telHref } from "@/lib/site";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "construction", (await getDictionary(locale)).construction.meta, "/media/group/site-cranes-dusk.webp");
}

const SKELA_GALLERY = [
  { src: "/media/skela-flex/full-wrap.webp", w: 1400, h: 1400 },
  { src: "/media/skela-flex/site-net.webp", w: 1200, h: 1600 },
  { src: "/media/skela-flex/truck.webp", w: 1600, h: 1200 },
  { src: "/media/skela-flex/green-net.webp", w: 1400, h: 1399 },
  { src: "/media/skela-flex/stock.webp", w: 1600, h: 1200 },
  { src: "/media/skela-flex/concrete-frame.webp", w: 1600, h: 1200 },
];

export default async function ConstructionPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.construction;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/group/site-cranes-dusk.webp" position="object-[50%_60%]" />

      <Stats items={t.facts} locale={locale} />

      {/* Services */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} />
          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.services.items.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="bg-paper p-7 md:p-9">
                <p className="eyebrow text-blue">{`0${i + 1}`}</p>
                <h3 className="font-display mt-4 text-2xl leading-tight md:text-[1.75rem]">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.references.eyebrow} title={t.references.title} />

          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[4/3] lg:col-span-6">
              <ParallaxImage src="/media/group/workers-rebar.webp" alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" strength={6} />
            </div>
            <Reveal className="lg:col-span-5 lg:col-start-8">
              <p className="eyebrow text-blue">2014</p>
              <h3 className="font-display mt-3 text-display-md leading-tight font-light">{t.references.sochi.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-muted">{t.references.sochi.body}</p>
              <ul className="mt-6 grid gap-2 border-t border-line pt-6 text-sm">
                {t.references.sochi.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-px w-4 shrink-0 bg-blue" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <ArrowLink href={projectHref(locale, "sochi-2014")} className="mt-8">
                {dict.common.viewProject}
              </ArrowLink>
            </Reveal>
          </div>

          <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal className="order-2 lg:order-1 lg:col-span-5">
              <p className="eyebrow text-blue">2019</p>
              <h3 className="font-display mt-3 text-display-md leading-tight font-light">{t.references.skopje.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-muted">{t.references.skopje.body}</p>
              <ArrowLink href={projectHref(locale, "skopje-east-gate")} className="mt-8">
                {dict.common.viewProject}
              </ArrowLink>
            </Reveal>
            <div className="relative order-1 aspect-[3/2] lg:order-2 lg:col-span-6 lg:col-start-7">
              <ParallaxImage src="/media/projects/skopje-east-gate/hero.webp" alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" strength={6} />
            </div>
          </div>

          <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[4/3] lg:col-span-6">
              <ParallaxImage src="/media/group/tirana-aerial-site.webp" alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" strength={6} />
            </div>
            <Reveal className="lg:col-span-5 lg:col-start-8">
              <p className="eyebrow text-blue">Tirana</p>
              <h3 className="font-display mt-3 text-display-md leading-tight font-light">{t.references.tirana.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-muted">{t.references.tirana.body}</p>
              <ArrowLink href={`/${locale}/projects#residences`} className="mt-8">
                {dict.common.allProjects}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Skela Flex */}
      <section id="skela-flex" className="scroll-mt-20 bg-navy py-24 text-paper md:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow={t.skela.eyebrow} title={t.skela.title} body={t.skela.body} tone="dark" />
              <Reveal delay={200}>
                <ul className="mt-8 grid gap-2 border-t border-line-dark pt-6 text-sm">
                  {t.skela.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={280} className="mt-10 border-t border-line-dark pt-8 text-sm">
                <p className="eyebrow text-paper/50">{t.skela.contact}</p>
                <ul className="mt-3 grid gap-2">
                  {site.skelaFlex.phones.map((p) => (
                    <li key={p}>
                      <a href={telHref(p)} className="hover:text-gold">{p}</a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${site.skelaFlex.email}`} className="hover:text-gold">{site.skelaFlex.email}</a>
                  </li>
                  <li className="text-paper/60">{site.skelaFlex.address}</li>
                </ul>
                <ArrowLink href={site.skelaFlex.instagram} external tone="dark" className="mt-6">
                  {t.skela.instagram}
                </ArrowLink>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="relative mb-4 aspect-[4/5] overflow-hidden sm:hidden">
                <Image src="/media/skela-flex/hero.webp" alt="" fill sizes="100vw" className="object-cover" />
              </div>
              <Gallery items={SKELA_GALLERY} alt="Skela Flex" openLabel={dict.common.openImage} closeLabel={dict.common.closeImage} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand dict={t.cta} locale={locale} tone="ink" />
    </>
  );
}
