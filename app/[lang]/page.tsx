import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { ArrowLink } from "@/components/arrow-link";
import { CtaBand } from "@/components/cta-band";
import { Hero } from "@/components/hero";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Stats } from "@/components/stats";
import { TowerSections } from "@/components/tower-sections";
import { isLocale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { getDictionary } from "./dictionaries";

export default async function HomePage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.home;

  return (
    <>
      <Hero dict={t.hero} closeLabel={dict.nav.close} />
      <Stats items={t.stats} floorsUnit={t.floorsUnit} />

      {/* Architecture teaser */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.architecture.eyebrow} title={t.architecture.title} body={t.architecture.body} />
            <Reveal delay={240} className="mt-8">
              <ArrowLink href={href(locale, "architecture")}>{t.architecture.link}</ArrowLink>
            </Reveal>
          </div>
          <div className="grid grid-cols-12 gap-4 lg:col-span-7">
            <ParallaxImage
              src="/media/reeds/tower-portrait.webp"
              alt={dict.architecture.captions.crown}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="col-span-8 aspect-[4/5]"
            />
            <ParallaxImage
              src="/media/reeds/facade-texture.webp"
              alt={dict.architecture.captions.facade}
              sizes="(min-width: 1024px) 20vw, 50vw"
              className="col-span-4 mt-16 aspect-[3/4]"
              strength={16}
            />
          </div>
        </div>
      </section>

      {/* Towers teaser */}
      <section className="border-t border-line bg-paper-2 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal variant="fade" className="order-2 lg:order-1 lg:col-span-4">
            <TowerSections towers={dict.towers.section.towers} labels={dict.towers.section} compact />
          </Reveal>
          <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
            <SectionHeading eyebrow={t.towers.eyebrow} title={t.towers.title} body={t.towers.body} />
            <Reveal delay={240} className="mt-8">
              <ArrowLink href={href(locale, "towers")}>{t.towers.link}</ArrowLink>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4">
              <ParallaxImage src="/media/reeds/pool.webp" alt={dict.towers.gallery[1].alt} sizes="(min-width: 1024px) 28vw, 50vw" className="aspect-[4/3]" />
              <ParallaxImage src="/media/reeds/restaurant.webp" alt={dict.towers.gallery[3].alt} sizes="(min-width: 1024px) 28vw, 50vw" className="aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>

      {/* Residences teaser */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <ParallaxImage src="/media/reeds/living.webp" alt={dict.residences.gallery[0].alt} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3]" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading eyebrow={t.residences.eyebrow} title={t.residences.title} body={t.residences.body} tone="dark" />
            <Reveal delay={200}>
              <p className="font-display mt-8 text-3xl text-gold">{t.residences.from}</p>
            </Reveal>
            <Reveal delay={280} className="mt-8">
              <ArrowLink href={href(locale, "residences")} tone="dark">{t.residences.link}</ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Company teaser */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow={t.company.eyebrow} title={t.company.title} body={t.company.body} />
            <Reveal delay={240} className="mt-8">
              <ArrowLink href={href(locale, "company")}>{t.company.link}</ArrowLink>
            </Reveal>
          </div>
          <dl className="grid gap-8 self-end sm:grid-cols-3 lg:col-span-6">
            {t.company.facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 120} className="border-t border-line pt-6">
                <dd className="font-display text-4xl text-gold md:text-5xl">{f.value}</dd>
                <dt className="mt-2 text-sm text-muted">{f.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Location teaser */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 -z-10">
          <ParallaxImage src="/media/reeds/dusk.webp" alt="" sizes="100vw" className="h-full" strength={8} />
          <div className="absolute inset-0 bg-ink/55" />
        </div>
        <div className="container-x py-32 md:py-44">
          <SectionHeading eyebrow={t.location.eyebrow} title={t.location.title} body={t.location.body} tone="dark" />
          <Reveal delay={240} className="mt-8">
            <ArrowLink href={href(locale, "location")} tone="dark">{t.location.link}</ArrowLink>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.cta.title}
        body={t.cta.body}
        button={t.cta.button}
        whatsapp={t.cta.whatsapp}
        whatsappText={dict.contact.whatsappText}
        locale={locale}
      />
    </>
  );
}
