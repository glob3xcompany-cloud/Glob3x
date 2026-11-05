import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { Timeline } from "@/components/timeline";
import { formatNumber } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { PORTFOLIO, PROJECTS } from "@/lib/projects";
import { href } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "group", (await getDictionary(locale)).group.meta, "/media/group/tirana-aerial-site.webp");
}

const COUNTRY_IMAGES: Record<string, string> = {
  AL: "/media/group/skyline-dusk.webp",
  MK: "/media/projects/skopje-east-gate/night.webp",
  RU: "/media/projects/sochi-2014/krasnaya-polyana.webp",
};

export default async function GroupPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.group;
  const c = dict.common;

  const numbers = [
    { value: String(PORTFOLIO.projects), label: `${c.projectsCount} · ${PORTFOLIO.ongoing} ${c.status.ongoing.toLowerCase()} · ${PORTFOLIO.completed} ${c.status.completed.toLowerCase()}` },
    { value: `${formatNumber(locale, PORTFOLIO.gfa, 0)} m²`, label: c.fact.gfa },
    { value: `${formatNumber(locale, PORTFOLIO.tallest)} m`, label: c.fact.height },
    { value: String(PORTFOLIO.countries), label: c.countriesCount },
  ];

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/group/tirana-aerial-site.webp" position="object-[50%_35%]" />

      {/* Manifesto */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <SectionHeading eyebrow={t.manifesto.eyebrow} title={t.manifesto.title} className="lg:col-span-5" />
          <div className="grid gap-6 text-base leading-relaxed text-ink/80 md:text-lg lg:col-span-7 lg:pt-16">
            {t.manifesto.body.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className={i === 0 ? "font-display text-2xl leading-snug text-ink md:text-3xl" : ""}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats items={numbers} locale={locale} tone="dark" />

      {/* Companies */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.companies.eyebrow} title={t.companies.title} />
          <ol className="mt-14 border-t border-line">
            {t.companies.items.map((c, i) => (
              <li key={c.title} className="border-b border-line">
                <Reveal delay={i * 60}>
                  <Link href={href(locale, c.href)} className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                    <span className="eyebrow text-blue md:col-span-1">{`0${i + 1}`}</span>
                    <h3 className="font-display text-3xl leading-tight md:col-span-4 md:text-4xl">{c.title}</h3>
                    <div className="md:col-span-6">
                      <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-ink/60 uppercase">{c.kicker}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">{c.body}</p>
                    </div>
                    <span aria-hidden="true" className="text-2xl text-blue transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 md:col-span-1 md:text-right">
                      →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.values.eyebrow} title={t.values.title} />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.items.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className="border-t border-ink/20 pt-6">
                <p className="eyebrow text-blue">{`0${i + 1}`}</p>
                <h3 className="font-display mt-3 text-2xl leading-tight md:text-3xl">{v.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative aspect-[21/9] min-h-[18rem]">
        <ParallaxImage src="/media/group/reeds-terraces.webp" alt="" sizes="100vw" className="h-full" strength={8} />
      </div>

      {/* Geography */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.geography.eyebrow} title={t.geography.title} />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {t.geography.items.map((g, i) => {
              const count = PROJECTS.filter((p) => p.country === g.country).length;
              return (
                <Reveal key={g.country} delay={i * 100} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image src={COUNTRY_IMAGES[g.country]} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]" />
                    <p className="font-display absolute bottom-4 left-5 text-5xl text-paper">
                      {count}
                      <span className="ml-2 text-base tracking-[0.08em] text-paper/70 uppercase">{c.projectsCount}</span>
                    </p>
                  </div>
                  <h3 className="font-display mt-6 text-2xl leading-tight md:text-3xl">{g.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{g.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-navy py-24 text-paper md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.timeline.eyebrow} title={t.timeline.title} tone="dark" />
          <div className="mt-16">
            <Timeline items={t.timeline.items} tone="dark" />
          </div>
        </div>
      </section>

      <CtaBand dict={t.cta} locale={locale} tone="ink" />
    </>
  );
}
