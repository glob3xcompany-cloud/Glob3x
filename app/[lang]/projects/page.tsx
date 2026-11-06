import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Agents } from "@/components/agents";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { PORTFOLIO, SECTORS, STATUSES, projectsBySector } from "@/lib/projects";
import { href } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getDictionary, projectCopy } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "projects", (await getDictionary(locale)).projects.meta, "/media/projects/reeds-towers/night-aerial.webp");
}

export default async function ProjectsPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.projects;
  const c = dict.common;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: href(locale) },
          { name: dict.nav.projects, path: href(locale, "projects") },
        ])}
      />

      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/projects/reeds-towers/night-aerial.webp" position="object-[50%_30%]">
        <dl className="animate-rise mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/20 pt-6 [animation-delay:360ms]">
          <div>
            <dd className="font-display text-4xl text-gold">{PORTFOLIO.projects}</dd>
            <dt className="text-[0.6875rem] tracking-[0.18em] text-paper/60 uppercase">{c.projectsCount}</dt>
          </div>
          {STATUSES.map((s) => (
            <div key={s}>
              <dd className="font-display text-4xl text-gold">{s === "ongoing" ? PORTFOLIO.ongoing : PORTFOLIO.completed}</dd>
              <dt className="text-[0.6875rem] tracking-[0.18em] text-paper/60 uppercase">{c.status[s]}</dt>
            </div>
          ))}
          <div>
            <dd className="font-display text-4xl text-gold">{PORTFOLIO.countries}</dd>
            <dt className="text-[0.6875rem] tracking-[0.18em] text-paper/60 uppercase">{c.countriesCount}</dt>
          </div>
        </dl>
      </PageHero>

      {/* Section index */}
      <nav aria-label={t.hero.eyebrow} className="sticky top-16 z-30 border-b border-line bg-paper/92 backdrop-blur-md md:top-20">
        <div className="container-x flex gap-6 overflow-x-auto py-4 text-[0.75rem] font-semibold tracking-[0.16em] whitespace-nowrap uppercase">
          {SECTORS.map((s, i) => (
            <a key={s} href={`#${s}`} className="text-ink/60 transition-colors hover:text-ink">
              <span className="mr-2 text-blue">{`0${i + 1}`}</span>
              {c.sector[s]}
            </a>
          ))}
        </div>
      </nav>

      {SECTORS.map((sector, si) => {
        const items = projectsBySector(sector);
        const dark = sector === "construction";
        const types = Array.from(new Set(items.map((p) => p.type)));
        return (
          <section key={sector} id={sector} className={`scroll-mt-32 py-24 md:py-32 ${dark ? "bg-navy text-paper" : si % 2 === 1 ? "bg-paper-2" : "bg-paper"}`}>
            <div className="container-x">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading eyebrow={`0${si + 1}`} title={t.sections[sector].title} body={t.sections[sector].body} tone={dark ? "dark" : "light"} />
                <ul className="flex flex-wrap gap-2 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                  {types.map((type) => (
                    <li key={type} className={`rounded-full border px-3 py-1.5 ${dark ? "border-paper/30 text-paper/80" : "border-ink/20 text-ink/70"}`}>
                      {c.type[type]}
                    </li>
                  ))}
                  {STATUSES.filter((s) => items.some((p) => p.status === s)).map((s) => (
                    <li key={s} className={`rounded-full px-3 py-1.5 ${s === "ongoing" ? "bg-blue text-paper" : dark ? "bg-paper text-ink" : "bg-ink text-paper"}`}>
                      {items.filter((p) => p.status === s).length} {c.status[s]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`mt-14 grid gap-x-6 gap-y-14 ${sector === "towers" ? "lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                {items.map((project, i) => (
                  <div key={project.slug} className={project.flagship ? "lg:col-span-2" : ""}>
                    <ProjectCard
                      project={project}
                      copy={projectCopy(dict, project.slug)}
                      statusLabel={c.status[project.status]}
                      typeLabel={c.type[project.type]}
                      forSaleLabel={c.forSale}
                      roleLabel={c.role[project.role]}
                      locale={locale}
                      size={project.flagship ? "lg" : sector === "towers" ? "tall" : "md"}
                      tone={dark ? "dark" : "light"}
                      delay={(i % 3) * 100}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Agents */}
      <section className="border-t border-line bg-paper-2 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.agents.eyebrow} title={t.agents.title} body={t.agents.body} />
          <div className="mt-14 border border-line bg-line">
            <Agents whatsappLabel={c.whatsapp} callLabel={c.call} />
          </div>
        </div>
      </section>

      <CtaBand dict={dict.home.cta} locale={locale} tone="ink" />
    </>
  );
}
