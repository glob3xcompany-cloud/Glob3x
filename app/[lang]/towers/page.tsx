import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { FactList } from "@/components/fact-list";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Skyline } from "@/components/skyline";
import { Stats } from "@/components/stats";
import { StatusBadge } from "@/components/status-badge";
import { formatNumber } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { TOWERS, factNumber } from "@/lib/projects";
import { href, projectHref } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getDictionary, projectCopy } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "towers", (await getDictionary(locale)).towers.meta, "/media/projects/reeds-towers/night-tower.webp");
}

export default async function TowersPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.towers;
  const c = dict.common;

  const totalGfa = TOWERS.reduce((s, p) => s + (factNumber(p, "gfa") ?? 0), 0);
  const tallest = Math.max(...TOWERS.map((p) => factNumber(p, "height") ?? 0));
  const stats = [
    { value: String(TOWERS.length), label: c.sector.towers },
    { value: `${formatNumber(locale, tallest)} m`, label: c.fact.height },
    { value: `${formatNumber(locale, Math.round(totalGfa), 0)} m²`, label: c.fact.gfa },
  ];

  const skyline = TOWERS.map((p) => {
    const copy = projectCopy(dict, p.slug);
    const floors = p.facts.find((f) => f.k === "floors");
    return {
      slug: p.slug,
      href: projectHref(locale, p.slug),
      name: copy.name,
      height: factNumber(p, "height") ?? 0,
      floors: floors ? ("v" in floors ? floors.v : "n" in floors ? String(floors.n) : undefined) : undefined,
      gfa: factNumber(p, "gfa"),
      kicker: copy.kicker,
      elevation: p.elevation,
    };
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: href(locale) },
          { name: dict.nav.towers, path: href(locale, "towers") },
        ])}
      />

      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/projects/reeds-towers/night-tower.webp" position="object-[50%_40%]" />

      <Stats items={stats} locale={locale} columns={3} />

      {/* Comparison */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.compare.eyebrow} title={t.compare.title} body={t.compare.body} />
          <div className="mt-14">
            <Skyline towers={skyline} labels={{ reference: t.compare.reference, height: c.fact.height, floors: c.fact.floors, gfa: c.fact.gfa }} locale={locale} />
          </div>
        </div>
      </section>

      {/* Each tower */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.list.eyebrow} title={t.list.title} />
          <div className="mt-16 grid gap-20">
            {TOWERS.map((p, i) => {
              const copy = projectCopy(dict, p.slug);
              const flip = i % 2 === 1;
              return (
                <article key={p.slug} className="grid gap-10 lg:grid-cols-12 lg:items-start">
                  <Link href={projectHref(locale, p.slug)} className={`group relative block aspect-[4/5] overflow-hidden bg-ink lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                    <Image src={p.cover.src} alt={copy.name} fill sizes="(min-width: 1024px) 42vw, 100vw" className={`object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04] ${p.cover.position ?? ""}`} />
                    <div className="absolute top-4 left-4">
                      <StatusBadge status={p.status} label={c.status[p.status]} />
                    </div>
                  </Link>
                  <Reveal className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                    <p className="eyebrow text-blue">{copy.kicker}</p>
                    <h3 className="font-display mt-3 text-display-md leading-tight font-light">{copy.name}</h3>
                    <p className="font-display mt-3 text-xl text-muted italic">{copy.tagline}</p>
                    <p className="mt-6 text-base leading-relaxed text-ink/80">{copy.intro}</p>
                    <div className="mt-8">
                      <FactList project={p} locale={locale} common={c} />
                    </div>
                    <ArrowLink href={projectHref(locale, p.slug)} className="mt-8">
                      {c.viewProject}
                    </ArrowLink>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand dict={t.cta} locale={locale} tone="ink" />
    </>
  );
}
