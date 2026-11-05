import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLink } from "@/components/arrow-link";
import { Gallery } from "@/components/gallery";
import { HeroVideo } from "@/components/hero-video";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/status-badge";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { PROJECTS, getProject } from "@/lib/projects";
import { href, projectHref } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { getDictionary, projectCopy } from "../../dictionaries";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang: locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  const dict = await getDictionary(locale);
  const copy = projectCopy(dict, slug);
  return pageMeta(locale, `projects/${slug}`, { title: `${copy.name} — ${copy.kicker}`, description: copy.intro }, project.hero.src);
}

/** Index into contact.interestOptions, so the preselection follows the locale. */
function interestIndex(slug: string, sector: string): number {
  if (slug === "reeds-towers") return 2;
  if (slug === "new-corner-residence") return 1;
  if (sector === "residences") return 0;
  if (sector === "construction") return 4;
  return 3;
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
  if (!isLocale(locale) || !project) notFound();
  const dict = await getDictionary(locale);
  const copy = projectCopy(dict, slug);
  const c = dict.common;

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nextCopy = projectCopy(dict, next.slug);
  const interest = dict.contact.interestOptions[interestIndex(slug, project.sector)];
  const contactHref = `${href(locale, "contact")}?interest=${encodeURIComponent(interest)}`;
  const externalUrl = project.externalUrl === "reeds" ? `${site.reedsSite}/${locale}` : project.externalUrl;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink text-paper">
        {project.video ? (
          <HeroVideo src={project.video.src} poster={project.video.poster} />
        ) : (
          <div className="animate-kenburns absolute inset-0 -z-20">
            <Image src={project.hero.src} alt="" fill priority sizes="100vw" className={`object-cover ${project.hero.position ?? "object-center"}`} />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.94)_0%,rgb(14_17_23/0.3)_55%,rgb(14_17_23/0.4)_100%)]" />
        <div className="container-x relative pt-40 pb-14 md:pb-20">
          <div className="animate-rise flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} label={c.status[project.status]} />
            <span className="rounded-full border border-paper/40 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">{c.role[project.role]}</span>
            {project.forSale ? <span className="rounded-full bg-paper/90 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] text-ink uppercase">{c.forSale}</span> : null}
          </div>
          <p className="eyebrow animate-rise mt-6 text-gold [animation-delay:80ms]">{copy.kicker}</p>
          <h1 className="font-display animate-rise mt-4 max-w-4xl text-display-xl leading-[0.98] font-light tracking-[-0.01em] text-balance [animation-delay:160ms]">{copy.name}</h1>
          <p className="font-display animate-rise mt-6 max-w-2xl text-2xl leading-snug text-paper/85 italic md:text-3xl [animation-delay:240ms]">{copy.tagline}</p>
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
              {externalUrl ? (
                <ArrowLink href={externalUrl} external>
                  {c.externalSite}
                </ArrowLink>
              ) : null}
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
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {copy.facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-5 gap-4 py-3.5 text-sm">
                    <dt className="col-span-2 text-muted">{f.label}</dt>
                    <dd className="col-span-3 font-medium text-ink">{f.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-4 py-3.5 text-sm">
                  <dt className="col-span-2 text-muted">{c.roleLabel}</dt>
                  <dd className="col-span-3 font-medium text-ink">{c.role[project.role]}</dd>
                </div>
              </dl>
              {project.partners?.length ? (
                <>
                  <p className="eyebrow mt-10 text-blue">{c.partners}</p>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {project.partners.map((p) => (
                      <li key={p.name} className="grid grid-cols-5 gap-4 py-3.5 text-sm">
                        <span className="col-span-2 text-muted">{c.partnerRole[p.role]}</span>
                        <span className="col-span-3 font-medium">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-blue">
                              {p.name}
                            </a>
                          ) : (
                            p.name
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
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
        <div className="relative aspect-[21/9] min-h-[16rem]">
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
