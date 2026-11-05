import type { Dictionary } from "@/app/[lang]/dictionaries";
import { formatFact } from "@/lib/format";
import type { Project } from "@/lib/projects";

/** Technical data of a project, rendered from lib/projects.ts with labels and number formats of the visitor's locale. */
export function FactList({ project, locale, common, tone = "light" }: { project: Project; locale: string; common: Dictionary["common"]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const dt = dark ? "text-paper/55" : "text-muted";
  const dd = dark ? "text-paper" : "text-ink";
  const divide = dark ? "divide-line-dark border-line-dark" : "divide-line border-line";
  const row = "grid grid-cols-5 gap-4 py-3.5 text-sm";
  return (
    <dl className={`divide-y border-y ${divide}`}>
      <div className={row}>
        <dt className={`col-span-2 ${dt}`}>{common.typeLabel}</dt>
        <dd className={`col-span-3 font-medium ${dd}`}>{common.type[project.type]}</dd>
      </div>
      <div className={row}>
        <dt className={`col-span-2 ${dt}`}>{common.statusLabel}</dt>
        <dd className={`col-span-3 font-medium ${dd}`}>{common.status[project.status]}</dd>
      </div>
      {project.facts.map((f) => (
        <div key={f.k} className={row}>
          <dt className={`col-span-2 ${dt}`}>{common.fact[f.k]}</dt>
          <dd className={`col-span-3 font-medium ${dd}`}>{formatFact(locale, f, common)}</dd>
        </div>
      ))}
      <div className={row}>
        <dt className={`col-span-2 ${dt}`}>{common.roleLabel}</dt>
        <dd className={`col-span-3 font-medium ${dd}`}>{common.role[project.role]}</dd>
      </div>
      <div className={row}>
        <dt className={`col-span-2 ${dt}`}>{common.countryLabel}</dt>
        <dd className={`col-span-3 font-medium ${dd}`}>{common.country[project.country]}</dd>
      </div>
    </dl>
  );
}

export function DistanceList({ project, common, tone = "light" }: { project: Project; common: Dictionary["common"]; tone?: "light" | "dark" }) {
  if (!project.distances?.length) return null;
  const dark = tone === "dark";
  return (
    <div className="mt-10">
      <p className={`eyebrow ${dark ? "text-gold" : "text-blue"}`}>{common.distances}</p>
      <dl className={`mt-4 divide-y border-y ${dark ? "divide-line-dark border-line-dark" : "divide-line border-line"}`}>
        {project.distances.map((d) => (
          <div key={d.place} className="flex items-baseline justify-between gap-4 py-3 text-sm">
            <dt className={dark ? "text-paper/55" : "text-muted"}>{common.place[d.place]}</dt>
            <dd className={`font-display text-xl ${dark ? "text-paper" : "text-ink"}`}>{d.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
