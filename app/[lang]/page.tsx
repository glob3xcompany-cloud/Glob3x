import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { Timeline } from "@/components/timeline";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { FLAGSHIP, getProject } from "@/lib/projects";
import { REEDS_SLUG, href, projectHref } from "@/lib/routes";
import { getDictionary, projectCopy } from "./dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMeta(locale, undefined, { title: dict.site.title, description: dict.site.description });
}

const PILLAR_IMAGES: Record<string, string> = {
  construction: "/media/group/site-cranes-dusk.webp",
  realestate: "/media/projects/lorden-residence/building-1.webp",
  skela: "/media/skela-flex/facade-scaffold.webp",
  hospitality: "/media/projects/hotel-varosh/pool.webp",
};

const SELECTED = ["lorden-residence", "new-corner-residence", "avi-residence-boulevard", "glow-tower", "art-residence", "skopje-east-gate"];

export default async function HomePage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.home;
  const reeds = projectCopy(dict, REEDS_SLUG);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
        <div className="animate-kenburns absolute inset-0 -z-20">
          <Image src="/media/group/skyline-dusk.webp" alt="" fill priority sizes="100vw" className="object-cover object-[60%_40%]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.94)_0%,rgb(14_17_23/0.35)_45%,rgb(14_17_23/0.25)_100%)]" />
        <div className="container-x relative pt-44 pb-16 md:pb-24">
          <p className="eyebrow animate-rise text-gold">{t.hero.eyebrow}</p>
          <h1 className="font-display animate-rise mt-5 max-w-5xl text-display-xl leading-[0.95] font-light tracking-[-0.015em] text-balance [animation-delay:120ms]">
            {t.hero.title}
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="animate-rise max-w-2xl text-base leading-relaxed text-paper/80 md:col-span-7 md:text-lg [animation-delay:240ms]">{t.hero.body}</p>
            <div className="animate-rise flex flex-col gap-4 sm:flex-row md:col-span-5 md:justify-end [animation-delay:360ms]">
              <Link href={href(locale, "projects")} className="btn-primary">
                {t.hero.primary}
              </Link>
              <Link href={href(locale, "group")} className="btn-outline text-paper">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Stats items={t.facts} />

      {/* Pillars */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.pillars.eyebrow} title={t.pillars.title} body={t.pillars.body} />
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {t.pillars.items.map((item, i) => (
              <Reveal key={item.key} delay={i * 100} className="h-full">
                <Link href={href(locale, item.href)} className="group flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                    <Image
                      src={PILLAR_IMAGES[item.key]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="eyebrow mt-6 text-blue">{`0${i + 1}`}</p>
                  <h3 className="font-display mt-2 text-2xl leading-tight md:text-[1.75rem]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.6875rem] font-semibold tracking-[0.18em] text-ink uppercase">
                    <span className="h-px w-8 bg-current transition-[width] duration-500 ease-out-expo group-hover:w-12" />
                    {dict.common.readMore}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship */}
      <section className="bg-navy text-paper">
        <div className="grid lg:grid-cols-12">
          <div className="relative min-h-[22rem] lg:col-span-7 lg:min-h-[48rem]">
            <ParallaxImage src="/media/projects/reeds-towers/dusk.webp" alt={reeds.name} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full min-h-[22rem]" strength={8} />
          </div>
          <div className="container-x flex flex-col justify-center py-20 lg:col-span-5 lg:max-w-none lg:py-28 lg:pl-16">
            <Reveal>
              <p className="eyebrow text-gold">{t.flagship.eyebrow}</p>
              <h2 className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{t.flagship.title}</h2>
              <p className="mt-6 text-base leading-relaxed text-paper/70 md:text-lg">{t.flagship.body}</p>
            </Reveal>
            <Reveal delay={120}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line-dark pt-8">
                {t.flagship.facts.map((f) => (
                  <div key={f.label}>
                    <dd className="font-display text-3xl text-gold md:text-4xl">{f.value}</dd>
                    <dt className="mt-1 text-[0.75rem] tracking-[0.04em] text-paper/60">{f.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={200} className="mt-10">
              <ArrowLink href={projectHref(locale, FLAGSHIP.slug)} tone="dark">
                {t.flagship.link}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Selected projects */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} body={t.projects.body} />
            <Reveal delay={200} className="shrink-0">
              <ArrowLink href={href(locale, "projects")}>{t.projects.link}</ArrowLink>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTED.map((slug, i) => {
              const project = getProject(slug);
              if (!project) return null;
              return (
                <ProjectCard
                  key={slug}
                  project={project}
                  copy={projectCopy(dict, slug)}
                  statusLabel={dict.common.status[project.status]}
                  forSaleLabel={dict.common.forSale}
                  roleLabel={dict.common.role[project.role]}
                  locale={locale}
                  delay={(i % 3) * 100}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={t.timeline.eyebrow} title={t.timeline.title} />
            <Reveal delay={200} className="shrink-0">
              <ArrowLink href={href(locale, "group")}>{t.timeline.link}</ArrowLink>
            </Reveal>
          </div>
          <div className="mt-16">
            <Timeline items={t.timeline.items} />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-line bg-paper py-20 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <SectionHeading eyebrow={t.partners.eyebrow} title={t.partners.title} className="lg:col-span-4" />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {t.partners.items.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="bg-paper p-6 md:p-8">
                <p className="font-display text-2xl md:text-3xl">{p.name}</p>
                <p className="mt-2 text-[0.75rem] tracking-[0.08em] text-muted uppercase">{p.role}</p>
              </Reveal>
            ))}
            <Reveal delay={400} className="bg-navy p-6 text-paper md:p-8">
              <p className="eyebrow text-gold">Reeds Towers</p>
              <p className="font-display mt-2 text-2xl leading-tight">{reeds.tagline}</p>
              <ArrowLink href={projectHref(locale, REEDS_SLUG)} tone="dark" className="mt-6">
                {dict.common.viewProject}
              </ArrowLink>
            </Reveal>
          </ul>
        </div>
      </section>

      <CtaBand dict={t.cta} locale={locale} />
    </>
  );
}
