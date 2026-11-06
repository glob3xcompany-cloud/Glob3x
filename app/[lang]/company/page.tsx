import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { CountUp } from "@/components/motion/count-up";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { getDictionary } from "../dictionaries";

/** Renders "820+" / "191 m" as a count-up number followed by its suffix; years stay static. */
function Figure({ value, animate }: { value: string; animate: boolean }) {
  const m = /^(\d[\d,]*)(.*)$/.exec(value);
  if (!animate || !m) return <>{value}</>;
  const n = Number(m[1].replace(/,/g, ""));
  const suffix = m[2];
  return (
    <>
      <CountUp value={n} />
      {suffix.startsWith(" ") ? <span className="text-[0.5em]">{suffix}</span> : suffix}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "company", (await getDictionary(locale)).company.meta);
}

export default async function CompanyPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.company;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/night-aerial.webp" />

      {/* Model: contractor, developer and builder of every project */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-gold">{t.model.eyebrow}</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-display mt-6 max-w-5xl text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.08]">{t.model.statement}</p>
          </Reveal>
          <ol className="mt-16 grid gap-10 md:grid-cols-3">
            {t.model.steps.map((s, i) => (
              <Reveal key={s.n} delay={200 + i * 140} className="border-t border-gold/60 pt-6">
                <span className="font-display text-2xl text-gold">{s.n}</span>
                <h3 className="font-display mt-3 text-3xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Key facts */}
      <section className="border-b border-line bg-paper">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {t.facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 100}
              className={`py-10 md:py-14 ${i % 2 === 1 ? "border-l border-line pl-6 lg:pl-10" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0 lg:border-l lg:pl-10" : ""}`}
            >
              <dd className="font-display text-4xl text-gold md:text-5xl lg:text-6xl">
                <Figure value={f.value} animate={i !== 0} />
              </dd>
              <dt className="mt-3 text-[0.8125rem] tracking-[0.04em] text-muted">{f.label}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Timeline */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t.timeline.eyebrow} title={t.timeline.title} />
            <div className="mt-10 hidden lg:block">
              <ParallaxImage src="/media/reeds/plaza-aerial.webp" alt="" sizes="30vw" className="aspect-[4/5]" />
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {t.timeline.items.map((item, i) => (
              <Reveal key={item.year} delay={i * 100} className="grid gap-4 border-t border-line py-8 md:grid-cols-[8rem_1fr] md:gap-8">
                <div className="font-display text-3xl text-gold">{item.year}</div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Portfolio */}
      <section className="border-t border-line bg-paper-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} />
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.projects.items.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="border-t border-ink/30 pt-5">
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className="mt-2 text-sm text-muted">{p.detail}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-gold">{t.values.eyebrow}</p>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {t.values.items.map((v, i) => (
              <Reveal key={v.title} delay={i * 120} className="border-t border-line-dark pt-6">
                <h3 className="font-display text-2xl md:text-3xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/70">{v.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-16 flex flex-col gap-6 border-t border-line-dark pt-10 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-paper/60">
              <p>{site.company} · {site.address}</p>
              <p className="mt-1">
                <a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a> · <a href={`tel:+${site.whatsapp}`} className="hover:text-paper">{site.phoneDisplay}</a>
              </p>
            </div>
            <Link
              href={href(locale, "contact")}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2"
            >
              {t.cta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
