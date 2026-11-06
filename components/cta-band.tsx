import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { Reveal } from "./motion/reveal";

export function CtaBand({
  title,
  body,
  button,
  whatsapp,
  whatsappText,
  locale,
}: {
  title: string;
  body: string;
  button: string;
  whatsapp: string;
  whatsappText: string;
  locale: Locale;
}) {
  return (
    <section className="border-t border-line-dark bg-ink py-20 text-paper md:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <h2 className="font-display text-display-lg leading-[1.02] font-light tracking-[-0.01em]">{title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">{body}</p>
        </Reveal>
        <Reveal delay={150} className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
          <Link
            href={href(locale, "contact")}
            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2"
          >
            {button}
          </Link>
          <a
            href={whatsappUrl(whatsappText)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-paper/30 px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] uppercase transition-colors hover:border-paper"
          >
            {whatsapp}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
