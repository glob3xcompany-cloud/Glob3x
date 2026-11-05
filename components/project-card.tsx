import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { projectHref } from "@/lib/routes";
import { Reveal } from "./motion/reveal";
import { StatusBadge } from "./status-badge";

export type ProjectCopy = { name: string; kicker: string; tagline: string };

export function ProjectCard({
  project,
  copy,
  statusLabel,
  forSaleLabel,
  roleLabel,
  locale,
  size = "md",
  tone = "light",
  delay = 0,
}: {
  project: Project;
  copy: ProjectCopy;
  statusLabel: string;
  forSaleLabel: string;
  roleLabel: string;
  locale: Locale;
  size?: "md" | "lg" | "tall";
  tone?: "light" | "dark";
  delay?: number;
}) {
  const ratio = size === "lg" ? "aspect-[16/10]" : size === "tall" ? "aspect-[4/5]" : "aspect-[4/3]";
  const dark = tone === "dark";
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={projectHref(locale, project.slug)} className="group flex h-full flex-col">
        <div className={`relative overflow-hidden ${dark ? "bg-ink-2" : "bg-paper-2"} ${ratio}`}>
          <Image
            src={project.cover.src}
            alt={copy.name}
            fill
            sizes={size === "lg" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={`object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04] ${project.cover.position ?? ""}`}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
            <StatusBadge status={project.status} label={statusLabel} />
            {project.forSale ? <span className="rounded-full bg-paper/90 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] text-ink uppercase">{forSaleLabel}</span> : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <p className={`eyebrow ${dark ? "text-gold" : "text-blue"}`}>{copy.kicker}</p>
          <h3 className={`font-display mt-2 leading-tight ${size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.75rem]"}`}>{copy.name}</h3>
          <p className={`mt-2 text-sm leading-relaxed md:text-[0.9375rem] ${dark ? "text-paper/65" : "text-muted"}`}>{copy.tagline}</p>
          <span className={`mt-auto inline-flex items-center gap-2 pt-5 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase ${dark ? "text-paper" : "text-ink"}`}>
            <span className="h-px w-8 bg-current transition-[width] duration-500 ease-out-expo group-hover:w-12" />
            {roleLabel}
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
