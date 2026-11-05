import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { Reveal } from "./motion/reveal";

export type CtaDict = { title: string; body: string; button: string; whatsapp: string; whatsappText: string };

export function CtaBand({ dict, locale, tone = "navy" }: { dict: CtaDict; locale: Locale; tone?: "navy" | "ink" }) {
  return (
    <section className={`border-t border-line-dark py-20 text-paper md:py-28 ${tone === "navy" ? "bg-navy" : "bg-ink"}`}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <h2 className="font-display text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{dict.title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">{dict.body}</p>
        </Reveal>
        <Reveal delay={150} className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
          <Link href={href(locale, "contact")} className="btn-primary">
            {dict.button}
          </Link>
          <a href={whatsappUrl(dict.whatsappText)} target="_blank" rel="noreferrer" className="btn-outline">
            {dict.whatsapp}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
