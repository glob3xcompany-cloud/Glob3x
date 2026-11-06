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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "architecture", (await getDictionary(locale)).architecture.meta);
}

export default async function ArchitecturePage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.architecture;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/towers-close.webp" alt={t.captions.crown} />

      {/* Concept: three paragraphs = garden / stems / crown, with matching images */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.concept.eyebrow} title={t.concept.title} />
          <div className="mt-16 grid gap-y-20">
            {t.concept.paragraphs.map((p, i) => {
              const media = [
                { src: "/media/reeds/plaza.webp", caption: t.captions.plaza, ratio: "aspect-[16/10]" },
                { src: "/media/reeds/facade.webp", caption: t.captions.facade, ratio: "aspect-[4/5]" },
                { src: "/media/reeds/towers-close.webp", caption: t.captions.crown, ratio: "aspect-[16/10]" },
              ][i];
              const flip = i % 2 === 1;
              return (
                <div key={i} className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <Reveal className={`lg:col-span-4 ${flip ? "lg:order-2 lg:col-start-9" : ""}`}>
                    <span className="font-display block text-6xl text-gold/60">0{i + 1}</span>
                    <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{p}</p>
                  </Reveal>
                  <figure className={`lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
                    <ParallaxImage src={media.src} alt={media.caption} sizes="(min-width: 1024px) 58vw, 100vw" className={`${media.ratio} ${flip ? "lg:aspect-[3/4] lg:max-w-xl" : ""}`} />
                    <figcaption className="mt-3 text-[0.75rem] tracking-[0.06em] text-muted">{media.caption}</figcaption>
                  </figure>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Façade + landscape */}
      <section className="border-t border-line bg-paper-2 py-20 md:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <ParallaxImage src="/media/reeds/facade-texture.webp" alt={t.captions.facade} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3]" />
            <div className="mt-8">
              <SectionHeading eyebrow={t.facade.eyebrow} title={t.facade.title} body={t.facade.body} />
            </div>
          </div>
          <div className="lg:mt-24">
            <ParallaxImage src="/media/reeds/terrace.webp" alt={t.captions.terrace} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3]" />
            <div className="mt-8">
              <SectionHeading eyebrow={t.landscape.eyebrow} title={t.landscape.title} body={t.landscape.body} />
            </div>
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
