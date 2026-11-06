import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { HeroVideo } from "@/components/hero-video";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { Timeline } from "@/components/timeline";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { FLAGSHIP, type Project, TOWERS, getProject, projectsByStatus } from "@/lib/projects";
import { REEDS_SLUG, href, projectHref, reedsSiteHref } from "@/lib/routes";
import { site } from "@/lib/site";
import { type Dictionary, getDictionary, projectCopy } from "./dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMeta(locale, undefined, { title: dict.site.title, description: dict.site.description }, "/media/projects/reeds-towers/hero-poster.jpg");
}

const PILLAR_IMAGES: Record<string, string> = {
  construction: "/media/group/site-cranes-dusk.webp",
  realestate: "/media/projects/lorden-residence/render-court.webp",
  towers: "/media/projects/reeds-towers/night-tower.webp",
  hospitality: "/media/projects/luxury-hotel-peze/pool-wide.webp",
  skela: "/media/skela-flex/facade-scaffold.webp",
};

function Cards({ projects, dict, locale, tone = "light", size = "md" }: { projects: Project[]; dict: Dictionary; locale: string; tone?: "light" | "dark"; size?: "md" | "tall" }) {
  return (
    <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          copy={projectCopy(dict, project.slug)}
          statusLabel={dict.common.status[project.status]}
          typeLabel={dict.common.type[project.type]}
          forSaleLabel={dict.common.forSale}
          roleLabel={dict.common.role[project.role]}
          locale={locale}
          size={size}
          tone={tone}
          delay={(i % 3) * 100}
        />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.home;
  const reeds = projectCopy(dict, REEDS_SLUG);
  const villas = getProject("luxury-villas-drymades")!;
  const ongoing = projectsByStatus("ongoing").filter((p) => p.sector !== "towers");
  const completed = projectsByStatus("completed");

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
        <HeroVideo src={FLAGSHIP.video!.src} poster={FLAGSHIP.video!.poster} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.94)_0%,rgb(14_17_23/0.35)_45%,rgb(14_17_23/0.3)_100%)]" />
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
              <Link href={href(locale, "towers")} className="btn-outline text-paper">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Stats items={t.facts} locale={locale} />

      {/* Pillars */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.pillars.eyebrow} title={t.pillars.title} body={t.pillars.body} />
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {t.pillars.items.map((item, i) => (
              <Reveal key={item.key} delay={i * 100} className="h-full">
                <Link href={href(locale, item.href)} className="group flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                    <Image
                      src={PILLAR_IMAGES[item.key]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="eyebrow mt-6 text-blue">{`0${i + 1}`}</p>
                  <h3 className="font-display mt-2 text-2xl leading-tight md:text-[1.6rem]">{item.title}</h3>
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
            <Reveal delay={200} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={projectHref(locale, FLAGSHIP.slug)} className="btn-primary">
                {t.flagship.link}
              </Link>
              <ArrowLink href={reedsSiteHref(site.reedsSite, locale)} external tone="dark">
                {dict.reeds.microsite}
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Towers */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={t.towers.eyebrow} title={t.towers.title} body={t.towers.body} />
            <Reveal delay={200} className="shrink-0">
              <ArrowLink href={href(locale, "towers")}>{t.towers.link}</ArrowLink>
            </Reveal>
          </div>
          <Cards projects={[...TOWERS]} dict={dict} locale={locale} size="tall" />
        </div>
      </section>

      {/* Ongoing */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.ongoing.eyebrow} title={t.ongoing.title} body={t.ongoing.body} />
          <Cards projects={ongoing} dict={dict} locale={locale} />
        </div>
      </section>

      {/* Coast: villas film */}
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-ink text-paper">
        <HeroVideo src={villas.video!.src} poster={villas.video!.poster} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.9)_0%,rgb(14_17_23/0.2)_55%,rgb(14_17_23/0.1)_100%)]" />
        <div className="container-x relative grid gap-8 pt-32 pb-16 md:pb-24 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-gold">{t.coast.eyebrow}</p>
            <h2 className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{t.coast.title}</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">{t.coast.body}</p>
          </Reveal>
          <Reveal delay={150} className="lg:col-span-5 lg:justify-self-end">
            <ArrowLink href={projectHref(locale, villas.slug)} tone="dark">
              {t.coast.link}
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* Completed */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={t.completed.eyebrow} title={t.completed.title} body={t.completed.body} />
            <Reveal delay={200} className="shrink-0">
              <ArrowLink href={href(locale, "projects")}>{dict.common.allProjects}</ArrowLink>
            </Reveal>
          </div>
          <Cards projects={completed} dict={dict} locale={locale} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-line-dark bg-ink py-24 text-paper md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} body={t.process.body} tone="dark" />
          <div className="mt-14 grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {t.process.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="bg-ink p-7 md:p-9">
                <p className="font-display text-4xl text-gold">{`0${i + 1}`}</p>
                <h3 className="mt-5 text-base font-semibold tracking-[0.02em]">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{s.body}</p>
              </Reveal>
            ))}
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

      <CtaBand dict={t.cta} locale={locale} />
    </>
  );
}
