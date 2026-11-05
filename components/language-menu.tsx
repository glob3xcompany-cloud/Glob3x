"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Locale, localeName, locales } from "@/lib/i18n";
import { localizedPath } from "@/lib/routes";

/** Compact language switcher: current code as trigger, native names in the list. Keeps the visitor on the same page. */
export function LanguageMenu({ locale, label, align = "right" }: { locale: Locale; label: string; align?: "left" | "right" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.2em] uppercase opacity-80 hover:opacity-100"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
        </svg>
        {locale.toUpperCase()}
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute top-full z-50 mt-3 min-w-44 border border-line bg-paper py-2 text-ink shadow-[0_18px_40px_-20px_rgb(14_17_23/0.5)] ${align === "right" ? "right-0" : "left-0"}`}
        >
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <Link
                href={localizedPath(pathname, l)}
                hrefLang={l}
                lang={l}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-6 px-4 py-2 text-sm tracking-normal normal-case hover:bg-paper-2 ${l === locale ? "text-blue" : ""}`}
              >
                <span>{localeName(l)}</span>
                <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{l}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
