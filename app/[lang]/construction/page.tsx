import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { projectHref } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "construction", (await getDictionary(locale)).construction.meta, "/media/group/site-cranes-dusk.webp");
}

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
          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
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

      <CtaBand dict={t.cta} locale={locale} tone="ink" />
    </>
  );
}
