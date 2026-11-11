import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "privacy", (await getDictionary(locale)).privacy.meta);
}

/** Privacy and cookie policy for glob3x.com, including the Reeds Towers site served at /reeds. */
export default async function PrivacyPage() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const t = (await getDictionary(locale)).privacy;

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-x pt-40 pb-14 md:pb-20">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h1 className="font-display mt-5 max-w-4xl text-display-lg leading-[1.02] font-light text-balance">{t.title}</h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-paper/80 md:text-lg">{t.intro}</p>
          <p className="mt-6 text-sm text-paper/50">{t.updated}</p>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <div className="grid max-w-3xl gap-14">
            {t.sections.map((s) => (
              <article key={s.title}>
                <h2 className="font-display text-3xl font-light md:text-4xl">{s.title}</h2>
                <div className="mt-5 grid gap-4 text-base leading-relaxed text-ink/80">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
