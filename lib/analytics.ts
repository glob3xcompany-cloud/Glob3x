/**
 * Google tag (Google Ads conversions, optionally GA4) behind Google Consent Mode v2, and the Meta Pixel.
 * Nothing loads until NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_GA4_ID or NEXT_PUBLIC_META_PIXEL_ID is set at build time.
 * The visitor's choice lives in localStorage; the group site and the Reeds site share the glob3x.com
 * origin, so one choice covers both apps. Keep this file identical in glob3x-group-web and glob3x-web.
 */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const TAG_ID = GOOGLE_ADS_ID || GA4_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const trackingEnabled = TAG_ID !== "" || META_PIXEL_ID !== "";

export type TrackEvent = "lead" | "whatsapp" | "phone";

const EVENT_NAMES: Record<TrackEvent, string> = { lead: "generate_lead", whatsapp: "contact_whatsapp", phone: "contact_phone" };

/** Google Ads conversion labels (the part after the slash in "AW-123/AbC"). Events without a label are reported to GA4 only. */
const CONVERSION_LABELS: Partial<Record<TrackEvent, string>> = {
  lead: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL,
  whatsapp: process.env.NEXT_PUBLIC_ADS_WHATSAPP_LABEL,
};

/**
 * Meta standard events. Housing ads restrict the data a pixel may share, so only the event name and the
 * contact channel are sent, and automatic events (button clicks, page metadata) stay off via autoConfig.
 */
const META_EVENTS: Record<TrackEvent, [string, Record<string, string>?]> = {
  lead: ["Lead"],
  whatsapp: ["Contact", { content_name: "whatsapp" }],
  phone: ["Contact", { content_name: "phone" }],
};

export const CONSENT_KEY = "g3x-consent";
/** Bump when the purposes described on the banner change, so every visitor is asked again. */
export const CONSENT_VERSION = 2;
export const CONSENT_EVENT = "g3x:consent";
export const CONSENT_OPEN_EVENT = "g3x:consent-open";
/** 13 months, the longest lifetime the privacy policy promises for Google cookies. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 395;
const PIXEL_SCRIPT_ID = "meta-pixel";
const PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

const signals = (choice: ConsentChoice) => ({
  ad_storage: choice,
  ad_user_data: choice,
  ad_personalization: choice,
  analytics_storage: choice,
});

export function storedChoice(raw: string | null): ConsentChoice | null {
  try {
    const value = JSON.parse(raw ?? "null") as { v?: number; choice?: string } | null;
    return value?.v === CONSENT_VERSION && (value.choice === "granted" || value.choice === "denied") ? value.choice : null;
  } catch {
    return null;
  }
}

export function saveChoice(choice: ConsentChoice) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: CONSENT_VERSION, choice, at: new Date().toISOString() }));
  window.gtag?.("consent", "update", signals(choice));
  if (choice === "granted") loadPixel();
  else {
    if (pixelLoaded()) window.fbq?.("consent", "revoke");
    dropTrackingCookies();
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

const pixelLoaded = () => document.getElementById(PIXEL_SCRIPT_ID) !== null;

/**
 * fbevents.js is fetched only after consent, so a visitor who never accepts sends nothing to Meta.
 * Nothing is queued before that: fbevents.js does not flush a queue that starts with a revoke.
 */
function loadPixel() {
  if (!META_PIXEL_ID) return;
  if (pixelLoaded()) {
    window.fbq?.("consent", "grant");
    return;
  }
  window.fbq?.("set", "autoConfig", false, META_PIXEL_ID);
  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
  const script = document.createElement("script");
  script.id = PIXEL_SCRIPT_ID;
  script.async = true;
  script.src = PIXEL_SRC;
  document.head.appendChild(script);
}

/** Withdrawing consent must also remove what was stored under it, not only stop new cookies. */
function dropTrackingCookies() {
  const apex = location.hostname.replace(/^www\./, "");
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!/^(_ga|_gid|_gcl|_fbp|_fbc)/.test(name)) continue;
    for (const domain of ["", `; domain=.${apex}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
  }
}

/**
 * Inline bootstrap for the root layout. It must run before gtag.js: consent defaults to "denied"
 * everywhere, and a choice saved on an earlier visit is re-applied before the first hit. The Meta
 * Pixel is initialised here only when consent was already given; otherwise only the empty stub exists.
 */
export function trackingBootstrap(): string {
  const ids = [GOOGLE_ADS_ID, GA4_ID].filter(Boolean);
  const granted = `var granted=false;try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||'null');granted=!!(c&&c.v===${CONSENT_VERSION}&&c.choice==='granted')}catch(e){}`;
  const google = TAG_ID
    ? [
        "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;",
        `gtag('consent','default',${JSON.stringify({ ...signals("denied"), wait_for_update: 500 })});`,
        "gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);",
        `if(granted)gtag('consent','update',${JSON.stringify(signals("granted"))});`,
        "gtag('js',new Date());",
        ...ids.map((id) => `gtag('config',${JSON.stringify(id)},{cookie_expires:${COOKIE_MAX_AGE}});`),
      ]
    : [];
  const meta = META_PIXEL_ID
    ? [
        "!function(w){if(w.fbq)return;var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!w._fbq)w._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);",
        `if(granted){fbq('set','autoConfig',false,${JSON.stringify(META_PIXEL_ID)});fbq('init',${JSON.stringify(META_PIXEL_ID)});fbq('track','PageView');var s=document.createElement('script');s.id=${JSON.stringify(PIXEL_SCRIPT_ID)};s.async=true;s.src=${JSON.stringify(PIXEL_SRC)};document.head.appendChild(s)}`,
      ]
    : [];
  return [granted, ...google, ...meta].join("");
}

/** Client-side navigations do not reload the page, so the Pixel has to be told about each new page. */
export function trackPageView() {
  if (pixelLoaded()) window.fbq?.("track", "PageView");
}

/** Never pass personal data here (name, e-mail, phone, message): only the event and coarse labels. */
export function track(event: TrackEvent, params: Record<string, string> = {}) {
  const gtag = window.gtag;
  if (gtag) {
    gtag("event", EVENT_NAMES[event], params);
    const label = CONVERSION_LABELS[event];
    if (GOOGLE_ADS_ID && label) gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
  }
  const [name, data] = META_EVENTS[event];
  if (pixelLoaded()) window.fbq?.("track", name, data);
}
