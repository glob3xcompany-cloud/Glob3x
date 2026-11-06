"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { NAV, href } from "@/lib/routes";

type NavDict = Record<(typeof NAV)[number]["key"], string> & {
  home: string;
  cta: string;
  menu: string;
  close: string;
};

export function SiteHeader({ nav, locale }: { nav: NavDict; locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const other: Locale = locale === "en" ? "sq" : "en";
  const otherPath = pathname.replace(/^\/(en|sq)(?=\/|$)/, `/${other}`);
  const solid = scrolled || open;
  const isActive = (slug: string) => pathname === href(locale, slug);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        solid
          ? "bg-paper/90 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent text-paper"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href={href(locale)} className="font-display text-xl tracking-[0.18em] uppercase md:text-2xl">
          Reeds Towers
        </Link>

        <nav className="hidden items-center gap-7 text-[0.8125rem] font-medium tracking-[0.08em] lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.slug}
              href={href(locale, item.slug)}
              aria-current={isActive(item.slug) ? "page" : undefined}
              className={`border-b pb-0.5 transition-[opacity,border-color] hover:opacity-100 ${
                isActive(item.slug) ? "border-gold opacity-100" : "border-transparent opacity-75"
              }`}
            >
              {nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link href={otherPath} hrefLang={other} className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">
            {other}
          </Link>
          <Link
            href={href(locale, "contact")}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2"
          >
            {nav.cta}
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 items-center gap-3 text-[0.75rem] font-semibold tracking-[0.2em] uppercase lg:hidden"
        >
          {open ? nav.close : nav.menu}
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden ${open ? "block" : "hidden"} h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper text-ink`}
      >
        <nav className="container-x flex flex-col py-6" onClick={() => setOpen(false)}>
          <Link href={href(locale)} className="font-display border-b border-line py-5 text-3xl">
            {nav.home}
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.slug}
              href={href(locale, item.slug)}
              className={`font-display border-b border-line py-5 text-3xl ${isActive(item.slug) ? "text-gold" : ""}`}
            >
              {nav[item.key]}
            </Link>
          ))}
          <div className="mt-8 flex items-center justify-between">
            <Link href={otherPath} hrefLang={other} className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase">
              {other === "en" ? "English" : "Shqip"}
            </Link>
            <Link href={href(locale, "contact")} className="rounded-full bg-gold px-5 py-3 text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
              {nav.cta}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
