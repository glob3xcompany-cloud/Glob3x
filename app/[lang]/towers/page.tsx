import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { TowerSections } from "@/components/tower-sections";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { href } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

const GALLERY = [
  { src: "/media/reeds/living.webp", span: "md:col-span-7" },
  { src: "/media/reeds/pool.webp", span: "md:col-span-5" },
  { src: "/media/reeds/atrium.webp", span: "md:col-span-5" },
  { src: "/media/reeds/restaurant.webp", span: "md:col-span-7" },
  { src: "/media/reeds/spa.webp", span: "md:col-span-6" },
  { src: "/media/reeds/rooftop-sign.webp", span: "md:col-span-6" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "towers", (await getDictionary(locale)).towers.meta);
}

export default async function TowersPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.towers;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/towers-catalogue.webp" />

      {/* Schematic sections of both towers */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.section.eyebrow} title={t.section.title} body={t.section.body} />
          <Reveal delay={200} className="mt-14">
            <TowerSections towers={t.section.towers} labels={t.section} />
          </Reveal>
          <Reveal delay={300} className="mt-12">
            <Link
              href={href(locale, "units")}
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-paper uppercase transition-colors hover:bg-gold hover:text-ink"
            >
              {dict.units.cta} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-paper-2 py-20 md:py-28">
        <div className="container-x grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {t.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100} className="border-t border-ink/30 pt-6">
              <h3 className="font-display text-2xl md:text-3xl">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid grid-cols-1 gap-5 md:grid-cols-12">
          {GALLERY.map((g, i) => (
            <figure key={g.src} className={g.span}>
              <ParallaxImage src={g.src} alt={t.gallery[i].alt} sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[4/3] md:aspect-[3/2]" />
              <figcaption className="mt-2 text-[0.6875rem] tracking-[0.08em] text-muted uppercase">{t.gallery[i].caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CtaBand
        title={dict.home.cta.title}
        body={dict.home.cta.body}
        button={dict.home.cta.button}
        whatsapp={dict.home.cta.whatsapp}
        whatsappText={dict.contact.whatsappText}
        locale={locale}
      />
    </>
  );
}
