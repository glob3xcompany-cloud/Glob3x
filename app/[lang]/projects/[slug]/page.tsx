import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLink } from "@/components/arrow-link";
import { DistanceList, FactList } from "@/components/fact-list";
import { FilmDialog } from "@/components/film-dialog";
import { Gallery } from "@/components/gallery";
import { HeroVideo } from "@/components/hero-video";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/status-badge";
import { isLocale } from "@/lib/i18n";
import { projectMotion } from "@/lib/motion";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/seo";
import { PROJECTS, getProject } from "@/lib/projects";
import { REEDS_SLUG, href, interestIndex, projectHref } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { getDictionary, projectCopy } from "../../dictionaries";

/** Reeds Towers has its own, richer page at towers/reeds-towers/page.tsx. */
export async function generateStaticParams() {
  return PROJECTS.filter((p) => p.slug !== REEDS_SLUG).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang: locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  const dict = await getDictionary(locale);
  const copy = projectCopy(dict, slug);
  return pageMeta(locale, `projects/${slug}`, { title: `${copy.name} — ${copy.kicker}`, description: copy.intro }, project.hero.src);
}

/**
 * `slug` is URL data (a non-root param), so it is read inside a Suspense boundary: the layout shell
 * navigates instantly and the project streams in. The fallback reserves the dark hero area to avoid a jump.
 */
export default function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  return (
    <Suspense fallback={<section aria-hidden className="min-h-[88svh] bg-ink" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/[lang]/projects/[slug]">, "params">) {
  const { lang: locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project || slug === REEDS_SLUG) notFound();
  const dict = await getDictionary(locale);
  const copy = projectCopy(dict, slug);
  const c = dict.common;

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nextCopy = projectCopy(dict, next.slug);
  const interest = dict.contact.interestOptions[interestIndex(project)];
  const contactHref = `${href(locale, "contact")}?interest=${encodeURIComponent(interest)}`;
  const motion = projectMotion(project);

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project, copy, locale, projectHref(locale, slug)),
          breadcrumbJsonLd([
            { name: dict.nav.home, path: href(locale) },
            { name: dict.nav.projects, path: href(locale, "projects") },
            { name: copy.name, path: projectHref(locale, slug) },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink text-paper">
        {motion ? (
          <HeroVideo src={motion.src} poster={motion.poster} />
        ) : (
          <div className="animate-kenburns absolute inset-0 -z-20">
            <Image src={project.hero.src} alt="" fill priority sizes="100vw" className={`object-cover ${project.hero.position ?? "object-center"}`} />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.94)_0%,rgb(14_17_23/0.3)_55%,rgb(14_17_23/0.4)_100%)]" />
        <div className="container-x relative pt-40 pb-14 md:pb-20">
          <div className="animate-rise flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} label={c.status[project.status]} />
            <span className="rounded-full border border-paper/40 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">{c.type[project.type]}</span>
            <span className="rounded-full border border-paper/40 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">{c.role[project.role]}</span>
            {project.forSale ? <span className="rounded-full bg-paper/90 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] text-ink uppercase">{c.forSale}</span> : null}
          </div>
          <p className="eyebrow animate-rise mt-6 text-gold [animation-delay:80ms]">{copy.kicker}</p>
          <h1 className="font-display animate-rise mt-4 max-w-4xl text-display-xl leading-[0.98] font-light tracking-[-0.01em] text-balance [animation-delay:160ms]">{copy.name}</h1>
          <div className="animate-rise mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between [animation-delay:240ms]">
            <p className="font-display max-w-2xl text-2xl leading-snug text-paper/85 italic md:text-3xl">{copy.tagline}</p>
            {project.video ? <FilmDialog src={project.video.film ?? project.video.src} poster={project.video.poster} label={c.watchFilm} closeLabel={c.closeImage} /> : null}
          </div>
        </div>
      </section>

      {/* Intro + facts */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-display text-2xl leading-snug text-ink md:text-3xl">{copy.intro}</p>
            </Reveal>
            <div className="mt-10 grid gap-6 text-base leading-relaxed text-ink/80 md:text-lg">
              {copy.body.map((p, i) => (
                <Reveal key={i} delay={80 + i * 80}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={240} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <ArrowLink href={contactHref}>{c.enquire}</ArrowLink>
            </Reveal>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={120} className="lg:sticky lg:top-28">
              {project.logo ? (
                <div className="mb-8 flex h-20 items-center">
                  <Image src={project.logo} alt={copy.name} width={200} height={100} className="h-full w-auto object-contain object-left" />
                </div>
              ) : null}
              <p className="eyebrow text-blue">{c.facts}</p>
              <div className="mt-4">
                <FactList project={project} locale={locale} common={c} />
              </div>
              <DistanceList project={project} common={c} />
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery.length > 0 ? (
        <section className="border-t border-line bg-paper-2 py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow text-blue">{c.gallery}</p>
            </Reveal>
            <div className="mt-8">
              <Gallery items={project.gallery} alt={copy.name} openLabel={c.openImage} closeLabel={c.closeImage} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Plans */}
      {project.plans?.length ? (
        <section className="border-t border-line bg-paper py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow text-blue">{c.plans}</p>
            </Reveal>
            <div className="mt-8">
              <Gallery items={project.plans} alt={`${copy.name} — ${c.plans}`} openLabel={c.openImage} closeLabel={c.closeImage} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Enquire */}
      <section className="border-t border-line-dark bg-navy py-20 text-paper md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-gold">{copy.name}</p>
            <h2 className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{dict.home.cta.title}</h2>
          </Reveal>
          <Reveal delay={150} className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link href={contactHref} className="btn-primary">
              {c.enquire}
            </Link>
            <a href={whatsappUrl(`${dict.home.cta.whatsappText} (${copy.name})`)} target="_blank" rel="noreferrer" className="btn-outline">
              {c.whatsapp}
            </a>
          </Reveal>
        </div>
      </section>

      {/* Next project */}
      <Link href={projectHref(locale, next.slug)} className="group relative block overflow-hidden bg-ink text-paper">
        <div className="relative h-64 md:h-auto md:aspect-[21/9]">
          <Image src={next.cover.src} alt="" fill sizes="100vw" className={`object-cover opacity-60 transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.03] ${next.cover.position ?? ""}`} />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(14_17_23/0.9),rgb(14_17_23/0.2))]" />
          <div className="container-x absolute inset-x-0 bottom-0 pb-12">
            <p className="eyebrow text-gold">{c.nextProject}</p>
            <p className="font-display mt-3 text-display-md leading-none font-light">{nextCopy.name}</p>
            <p className="mt-2 text-sm text-paper/70">{nextCopy.kicker}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
