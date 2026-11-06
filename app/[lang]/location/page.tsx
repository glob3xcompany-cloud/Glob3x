import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

const LAT = 41.32376;
const LNG = 19.80001;
const BBOX = `${LNG - 0.012},${LAT - 0.006},${LNG + 0.012},${LAT + 0.006}`;
const EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${LAT},${LNG}`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

const ICONS = [
  <svg key="pin" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <path d="M16 29s9-8.4 9-15a9 9 0 1 0-18 0c0 6.6 9 15 9 15Z" />
    <circle cx="16" cy="14" r="3.5" />
  </svg>,
  <svg key="growth" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <path d="M4 26h24M7 22V14M13 22V10M19 22v-6M25 22V6" />
  </svg>,
  <svg key="sun" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <circle cx="16" cy="16" r="6" />
    <path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8" />
  </svg>,
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "location", (await getDictionary(locale)).location.meta);
}

export default async function LocationPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.location;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/hero-aerial.webp" />

      {/* Map + distances */}
      <section className="bg-paper-2">
        <div className="grid lg:grid-cols-12">
          <div className="container-x py-20 lg:col-span-5 lg:max-w-none lg:pr-12 md:py-28">
            <Reveal>
              <p className="eyebrow text-gold">{t.distances.eyebrow}</p>
            </Reveal>
            <dl className="mt-8">
              {t.distances.items.map((d, i) => (
                <Reveal key={d.label} delay={i * 80} className="flex items-baseline justify-between gap-6 border-t border-line py-5">
                  <dt className="text-base">{d.label}</dt>
                  <dd className="font-display text-2xl text-gold">{d.value}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={320} className="mt-10 border-t border-line pt-6">
              <address className="text-sm not-italic text-muted">{t.address}</address>
              <a href={MAPS} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.18em] uppercase">
                {t.open} <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
          <Reveal variant="clip" className="relative min-h-[24rem] lg:col-span-7 lg:min-h-[40rem]">
            <iframe
              title={t.hero.title}
              src={EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="reveal-scale absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.05] sepia-[0.15]"
            />
          </Reveal>
        </div>
      </section>

      {/* Why Tirana */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.why.eyebrow} title={t.why.title} />
            <div className="mt-10">
              <ParallaxImage src="/media/reeds/dusk.webp" alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
            </div>
          </div>
          <div className="grid content-start gap-10 lg:col-span-6 lg:col-start-7 lg:pt-16">
            {t.why.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 100} className="grid grid-cols-[3rem_1fr] gap-6 border-t border-line pt-8">
                <div className="h-9 w-9 text-gold">{ICONS[i]}</div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
