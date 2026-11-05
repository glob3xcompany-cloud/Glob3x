import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Agents } from "@/components/agents";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { SECTORS, projectsBySector } from "@/lib/projects";
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

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/projects/reeds-towers/night-aerial.webp" position="object-[50%_30%]" />

      {/* Section index */}
      <nav aria-label={t.hero.eyebrow} className="sticky top-16 z-30 border-b border-line bg-paper/92 backdrop-blur-md md:top-20">
        <div className="container-x flex gap-6 overflow-x-auto py-4 text-[0.75rem] font-semibold tracking-[0.16em] whitespace-nowrap uppercase">
          {SECTORS.map((s) => (
            <a key={s} href={`#${s}`} className="text-ink/60 transition-colors hover:text-ink">
              {dict.common.sector[s]}
            </a>
          ))}
        </div>
      </nav>

      {SECTORS.map((sector, si) => {
        const items = projectsBySector(sector);
        const dark = sector === "construction";
        return (
          <section key={sector} id={sector} className={`scroll-mt-32 py-24 md:py-32 ${dark ? "bg-navy text-paper" : si % 2 === 1 ? "bg-paper-2" : "bg-paper"}`}>
            <div className="container-x">
              <SectionHeading eyebrow={`0${si + 1}`} title={t.sections[sector].title} body={t.sections[sector].body} tone={dark ? "dark" : "light"} />
              <div className={`mt-14 grid gap-x-6 gap-y-14 ${sector === "towers" ? "lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                {items.map((project, i) => (
                  <div key={project.slug} className={project.flagship ? "lg:col-span-2" : ""}>
                    <ProjectCard
                      project={project}
                      copy={projectCopy(dict, project.slug)}
                      statusLabel={dict.common.status[project.status]}
                      forSaleLabel={dict.common.forSale}
                      roleLabel={dict.common.role[project.role]}
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
            <Agents whatsappLabel={dict.common.whatsapp} callLabel={dict.common.call} />
          </div>
        </div>
      </section>

      <CtaBand dict={dict.home.cta} locale={locale} tone="ink" />
    </>
  );
}
