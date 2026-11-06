import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { UnitSelector } from "@/components/unit-selector";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { href } from "@/lib/routes";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "units", (await getDictionary(locale)).units.meta);
}

export default async function UnitsPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.units;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} intro={t.hero.intro} image="/media/reeds/facade.webp" position="center 40%" />

      <section id="selector" className="scroll-mt-20 bg-paper py-16 md:py-24">
        <div className="container-x">
          <Suspense fallback={<div className="min-h-[60rem]" />}>
            <UnitSelector labels={t} contactHref={href(locale, "contact")} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
