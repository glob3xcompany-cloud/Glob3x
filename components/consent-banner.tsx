"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_KEY, CONSENT_OPEN_EVENT, type ConsentChoice, saveChoice, storedChoice, track, trackPageView } from "@/lib/analytics";

export type CookiesDict = { label: string; text: string; accept: string; reject: string; privacy: string; settings: string };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

const readStored = () => localStorage.getItem(CONSENT_KEY);
/** undefined on the server: the banner depends on localStorage, so it is never part of the static HTML. */
const serverSnapshot = () => undefined;

const button =
  "inline-flex flex-1 items-center justify-center rounded-full px-6 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-colors md:flex-none";

/** Cookie banner (Accept and Reject carry equal weight) plus page-view, WhatsApp and phone measurement for the whole page. */
export function ConsentBanner({ dict, privacyHref }: { dict: CookiesDict; privacyHref: string }) {
  const raw = useSyncExternalStore(subscribe, readStored, serverSnapshot);
  const [reopened, setReopened] = useState(false);
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  useEffect(() => {
    // The bootstrap already counted the page the visitor landed on.
    if (pathname !== firstPath.current) trackPageView();
    firstPath.current = "";
  }, [pathname]);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    // One listener catches every WhatsApp and phone link, including ones rendered after navigation.
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) track("whatsapp");
      else if (href.startsWith("tel:")) track("phone");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (raw === undefined || (storedChoice(raw) && !reopened)) return null;

  const choose = (choice: ConsentChoice) => {
    saveChoice(choice);
    setReopened(false);
  };

  return (
    <section aria-label={dict.label} className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 border border-paper/15 bg-ink/95 p-5 text-paper shadow-2xl backdrop-blur md:flex-row md:items-center md:gap-8 md:p-6">
        <p className="text-sm leading-relaxed text-paper/80">
          {dict.text}{" "}
          <a href={privacyHref} className="text-paper underline underline-offset-4 hover:text-gold">
            {dict.privacy}
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose("denied")} className={`${button} border border-paper/40 hover:border-paper`}>
            {dict.reject}
          </button>
          <button type="button" onClick={() => choose("granted")} className={`${button} bg-gold text-ink hover:bg-gold-2`}>
            {dict.accept}
          </button>
        </div>
      </div>
    </section>
  );
}

/** Footer link that reopens the banner, so a choice can be changed or withdrawn at any time. */
export function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="hover:text-gold">
      {label}
    </button>
  );
}
