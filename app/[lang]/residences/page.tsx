import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { CtaBand } from "@/components/cta-band";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { PaymentCalculator } from "@/components/payment-calculator";
import { SectionHeading } from "@/components/section-heading";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { href } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

const PLAN_SRC = ["/media/reeds/plan-typical-a.webp", "/media/reeds/plan-typical-b.webp", "/media/reeds/plan-typical-c.webp"];
const GALLERY = ["/media/reeds/living.webp", "/media/reeds/bath.webp", "/media/reeds/balcony.webp", "/media/reeds/terrace.webp"];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "residences", (await getDictionary(locale)).residences.meta);
}

export default async function ResidencesPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.residences;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/towers-mountains.webp" position="center 40%" />

      {/* Interiors */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.interiors.eyebrow} title={t.interiors.title} body={t.interiors.body} />
            <Reveal delay={240}>
              <p className="font-display mt-8 text-3xl text-gold md:text-4xl">{t.from}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-7">
            {GALLERY.map((src, i) => (
              <figure key={src} className={i % 3 === 0 ? "col-span-2" : ""}>
                <ParallaxImage src={src} alt={t.gallery[i].alt} sizes="(min-width: 1024px) 55vw, 100vw" className={i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"} />
                <figcaption className="mt-2 text-[0.6875rem] tracking-[0.08em] text-muted uppercase">{t.gallery[i].caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-gold">{t.plansTitle}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 120}>
                <figure className="plan-card group">
                  <div className="relative aspect-[1569/1693] overflow-hidden bg-paper">
                    <Image
                      src={PLAN_SRC[i]}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-contain p-6 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-4 border-t border-line-dark pt-4">
                    <span className="font-display block text-2xl">{p.name}</span>
                    <span className="mt-1 block text-sm text-paper/60">{p.detail}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-paper/50">{t.disclaimer}</p>
            <Link
              href={href(locale, "units")}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-6 py-3 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2"
            >
              {dict.units.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Prices + payment plan */}
      <section id="pricing" className="scroll-mt-20 bg-paper-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.pricing.eyebrow} title={t.pricing.title} body={t.pricing.body} />
          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {t.pricing.bands.map((b, i) => (
              <Reveal key={b.floors} delay={i * 120} className="bg-paper-2 py-8 md:px-8 md:first:pl-0">
                <p className="eyebrow text-muted">{b.floors}</p>
                <p className="font-display mt-4 text-5xl text-gold md:text-6xl">
                  {b.price}
                  {b.price.startsWith("€") && <span className="ml-2 text-xl text-muted">{t.pricing.perM2}</span>}
                </p>
                <p className="mt-3 text-sm text-muted">{b.note}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow={t.pricing.plan.eyebrow} title={t.pricing.plan.title} />
              <ol className="mt-10">
                {t.pricing.plan.steps.map((s, i) => (
                  <Reveal key={s.title} delay={i * 120} className="grid grid-cols-[6.5rem_1fr] gap-6 border-t border-line py-6">
                    <span className="font-display text-4xl text-gold">{s.value}</span>
                    <span>
                      <span className="font-display block text-2xl">{s.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{s.body}</span>
                    </span>
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal delay={200} className="text-paper lg:col-span-7">
              <PaymentCalculator labels={t.pricing.calculator} />
              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">{t.pricing.disclaimer}</p>
              <Link
                href={href(locale, "units")}
                className="mt-6 inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.18em] text-ink uppercase hover:text-gold"
              >
                {dict.units.cta} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="border-t border-line bg-paper py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.amenities.eyebrow} title={t.amenities.title} />
          </div>
          <ul className="grid gap-y-5 self-end sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {t.amenities.items.map((item, i) => (
              <Reveal key={item} delay={i * 80} className="flex items-start gap-4 border-t border-line pt-5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                <span className="text-base">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="container-x mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          <ParallaxImage src="/media/reeds/pool.webp" alt={dict.towers.gallery[1].alt} sizes="33vw" className="aspect-[4/3]" />
          <ParallaxImage src="/media/reeds/spa.webp" alt={dict.towers.gallery[4].alt} sizes="33vw" className="aspect-[4/3]" />
          <ParallaxImage src="/media/reeds/rooftop-sign.webp" alt={dict.towers.gallery[5].alt} sizes="33vw" className="col-span-2 aspect-[4/3] md:col-span-1" />
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
