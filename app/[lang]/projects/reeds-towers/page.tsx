import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { DistanceList, FactList } from "@/components/fact-list";
import { FilmDialog } from "@/components/film-dialog";
import { Gallery } from "@/components/gallery";
import { HeroVideo } from "@/components/hero-video";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { StatusBadge } from "@/components/status-badge";
import { TowerSections } from "@/components/tower-sections";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { FLAGSHIP, PROJECTS } from "@/lib/projects";
import { REEDS_SLUG, href, interestIndex, projectHref, reedsSiteHref } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { getDictionary, projectCopy } from "../../dictionaries";

const R = "/media/projects/reeds-towers";
const FILM = { src: `${R}/film-720.mp4`, poster: `${R}/hero-poster.jpg` };
const PLANS = [`${R}/plan-typical-a.webp`, `${R}/plan-typical-b.webp`, `${R}/plan-typical-c.webp`];
const RESIDENCE_GALLERY = [
  { src: `${R}/living.webp`, w: 2000, h: 1116 },
  { src: `${R}/bath.webp`, w: 2000, h: 1116 },
  { src: `${R}/balcony.webp`, w: 2000, h: 1116 },
  { src: `${R}/terrace.webp`, w: 2000, h: 1116 },
];
const LAT = 41.32376;
const LNG = 19.80001;
const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.012},${LAT - 0.006},${LNG + 0.012},${LAT + 0.006}&layer=mapnik&marker=${LAT},${LNG}`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const copy = projectCopy(dict, REEDS_SLUG);
  return pageMeta(locale, `projects/${REEDS_SLUG}`, { title: `${copy.name} — ${dict.reeds.hero.subtitle}`, description: copy.intro }, `${R}/hero-poster.jpg`);
}

export default async function ReedsPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const project = FLAGSHIP;
  const copy = projectCopy(dict, REEDS_SLUG);
  const t = dict.reeds;
  const c = dict.common;

  const index = PROJECTS.findIndex((p) => p.slug === REEDS_SLUG);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nextCopy = projectCopy(dict, next.slug);
  const interest = dict.contact.interestOptions[interestIndex(project)];
  const contactHref = `${href(locale, "contact")}?interest=${encodeURIComponent(interest)}`;
  const microsite = reedsSiteHref(site.reedsSite, locale);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
        <HeroVideo src={project.video!.src} poster={project.video!.poster} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.94)_0%,rgb(14_17_23/0.3)_55%,rgb(14_17_23/0.35)_100%)]" />
        <div className="container-x relative pt-40 pb-14 md:pb-20">
          <div className="animate-rise flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} label={c.status[project.status]} />
            <span className="rounded-full border border-paper/40 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">{c.type[project.type]}</span>
            <span className="rounded-full border border-paper/40 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">{c.role[project.role]}</span>
          </div>
          <p className="eyebrow animate-rise mt-6 text-gold [animation-delay:80ms]">{t.hero.eyebrow}</p>
          <h1 className="font-display animate-rise mt-4 max-w-4xl text-display-xl leading-[0.98] font-light tracking-[-0.01em] text-balance [animation-delay:160ms]">{t.hero.title}</h1>
          <div className="animate-rise mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between [animation-delay:240ms]">
            <p className="font-display max-w-2xl text-2xl leading-snug text-paper/85 italic md:text-3xl">{t.hero.subtitle}</p>
            <FilmDialog src={FILM.src} poster={FILM.poster} label={t.film} closeLabel={c.closeImage} />
          </div>
        </div>
      </section>

      <Stats items={t.stats} locale={locale} tone="dark" />

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
              <ArrowLink href={microsite} external>
                {c.externalSite}
              </ArrowLink>
            </Reveal>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={120} className="lg:sticky lg:top-28">
              <p className="eyebrow text-blue">{c.facts}</p>
              <div className="mt-4">
                <FactList project={project} locale={locale} common={c} />
              </div>
              <DistanceList project={project} common={c} />
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Concept */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.concept.eyebrow} title={t.concept.title} />
          <div className="mt-14 grid gap-12 lg:grid-cols-3">
            {t.concept.paragraphs.map((p, i) => {
              const img = [
                { src: `${R}/plaza-people.webp`, caption: t.captions.plaza },
                { src: `${R}/facade-texture.webp`, caption: t.captions.facade },
                { src: `${R}/terrace.webp`, caption: t.captions.terrace },
              ][i];
              return (
                <Reveal key={i} delay={i * 120}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image src={img.src} alt={img.caption} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <p className="mt-3 text-[0.6875rem] tracking-[0.12em] text-muted uppercase">{img.caption}</p>
                  <p className="mt-6 text-base leading-relaxed text-ink/80">{p}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Façade + landscape */}
      <section className="bg-paper py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] lg:col-span-6">
            <ParallaxImage src={`${R}/towers-close.webp`} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" strength={6} />
          </div>
          <div className="grid gap-12 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="eyebrow text-blue">{t.facade.eyebrow}</p>
              <h3 className="font-display mt-3 text-display-md leading-tight font-light">{t.facade.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-muted">{t.facade.body}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow text-blue">{t.landscape.eyebrow}</p>
              <h3 className="font-display mt-3 text-display-md leading-tight font-light">{t.landscape.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-muted">{t.landscape.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.section.eyebrow} title={t.section.title} body={t.section.body} />
          <div className="mt-16">
            <TowerSections towers={t.section.towers} labels={{ floor: t.section.floor, level: t.section.level, hint: t.section.hint }} locale={locale} />
          </div>
          <div className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="bg-paper-2 p-7 md:p-8">
                <p className="eyebrow text-blue">{`0${i + 1}`}</p>
                <h3 className="font-display mt-4 text-2xl leading-tight">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Residences */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading eyebrow={t.residences.eyebrow} title={t.residences.title} body={t.residences.body} tone="dark" className="lg:col-span-7" />
            <Reveal delay={200} className="lg:col-span-4 lg:col-start-9">
              <p className="font-display text-3xl text-gold">{t.residences.from}</p>
              <p className="eyebrow mt-8 text-paper/50">{t.residences.amenitiesTitle}</p>
              <ul className="mt-4 grid gap-2 border-t border-line-dark pt-4 text-sm">
                {t.residences.amenities.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <p className="eyebrow mt-20 text-gold">{t.residences.plansTitle}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {t.residences.plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <div className="relative aspect-[1569/1693] overflow-hidden bg-paper">
                  <Image src={PLANS[i]} alt={`${copy.name} — ${p.name}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain" />
                </div>
                <p className="font-display mt-4 text-2xl">{p.name}</p>
                <p className="mt-1 text-sm text-paper/60">{p.detail}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <Gallery items={RESIDENCE_GALLERY} alt={copy.name} openLabel={c.openImage} closeLabel={c.closeImage} />
          </div>

          <div className="mt-20 grid gap-10 border-t border-line-dark pt-12 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-8">
              <p className="eyebrow text-gold">{t.residences.pricing.eyebrow}</p>
              <h3 className="font-display mt-4 text-display-md leading-tight font-light text-balance">{t.residences.pricing.title}</h3>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70">{t.residences.pricing.body}</p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-4 lg:justify-self-end">
              <ArrowLink href={reedsSiteHref(site.reedsSite, locale, "residences")} external tone="dark">
                {t.residences.pricing.link}
              </ArrowLink>
            </Reveal>
          </div>
          <p className="mt-10 max-w-3xl text-[0.75rem] leading-relaxed text-paper/45">{t.residences.disclaimer}</p>
        </div>
      </section>

      {/* Gallery */}
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

      {/* Plans & drawings */}
      <section className="border-t border-line bg-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-blue">{c.plans}</p>
          </Reveal>
          <div className="mt-8">
            <Gallery items={project.plans!} alt={`${copy.name} — ${c.plans}`} openLabel={c.openImage} closeLabel={c.closeImage} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.location.eyebrow} title={t.location.title} body={t.location.body} />
            <Reveal delay={160} className="mt-8">
              <p className="text-sm text-muted">{t.location.address}</p>
              <ArrowLink href={`https://maps.google.com/?q=${LAT},${LNG}`} external className="mt-3">
                {t.location.open}
              </ArrowLink>
            </Reveal>
            <DistanceList project={project} common={c} />
          </div>
          <div className="lg:col-span-7">
            <Reveal variant="clip">
              <iframe title={t.location.title} src={MAP_SRC} loading="lazy" className="aspect-[4/3] w-full border border-line bg-paper grayscale-[0.4]" />
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {t.location.why.map((w, i) => (
                <Reveal key={w.title} delay={i * 100} className="border-t border-ink/20 pt-5">
                  <h3 className="font-display text-xl leading-tight">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{w.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquire */}
      <section className="border-t border-line-dark bg-navy py-20 text-paper md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-gold">{copy.name}</p>
            <h2 className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{dict.home.cta.title}</h2>
            <ArrowLink href={microsite} external tone="dark" className="mt-8">
              {t.microsite}
            </ArrowLink>
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
