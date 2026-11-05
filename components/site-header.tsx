"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { NAV, href } from "@/lib/routes";
import { BrandLogo } from "./brand-logo";
import { LanguageMenu } from "./language-menu";

type NavDict = Record<(typeof NAV)[number]["key"], string> & {
  contact: string;
  cta: string;
  menu: string;
  close: string;
  language: string;
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

  const solid = scrolled || open;
  const isActive = (slug: string) => (slug ? pathname === href(locale, slug) || pathname.startsWith(href(locale, slug) + "/") : pathname === href(locale));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        solid ? "bg-paper/92 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md" : "bg-transparent text-paper"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href={href(locale)} aria-label="Glob3x Group" className="flex items-center">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-7 text-[0.8125rem] font-medium tracking-[0.08em] lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
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
          <LanguageMenu locale={locale} label={nav.language} />
          <Link href={href(locale, "contact")} className="btn-primary !py-2.5 !px-5">
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
            <span className={`absolute top-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`lg:hidden ${open ? "block" : "hidden"} h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper text-ink`}>
        <nav className="container-x flex flex-col py-6">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={href(locale, item.slug)}
              onClick={() => setOpen(false)}
              className={`font-display border-b border-line py-5 text-3xl ${isActive(item.slug) ? "text-blue" : ""}`}
            >
              {nav[item.key]}
            </Link>
          ))}
          <Link href={href(locale, "contact")} onClick={() => setOpen(false)} className="font-display border-b border-line py-5 text-3xl">
            {nav.contact}
          </Link>
          <div className="mt-8 flex items-center justify-between">
            <LanguageMenu locale={locale} label={nav.language} align="left" />
            <Link href={href(locale, "contact")} onClick={() => setOpen(false)} className="btn-primary">
              {nav.cta}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
