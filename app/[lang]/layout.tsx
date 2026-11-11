import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import Script from "next/script";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TAG_ID, trackingBootstrap, trackingEnabled } from "@/lib/analytics";
import { isLocale, locales } from "@/lib/i18n";
import { BASE_PATH, privacyUrl, site } from "@/lib/site";
import { getDictionary } from "./dictionaries";
import "../globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((l) => ({ lang: l }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(site.groupSite),
    title: { default: dict.site.title, template: `%s | ${dict.site.name}` },
    description: dict.site.description,
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: "website",
      locale: locale === "sq" ? "sq_AL" : "en_GB",
      siteName: dict.site.name,
      images: [{ url: `${BASE_PATH}/media/reeds/hero-aerial.webp`, width: 2560, height: 1429 }],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {trackingEnabled ? (
          <Script id="tracking-consent" strategy="beforeInteractive">
            {trackingBootstrap()}
          </Script>
        ) : null}
        {TAG_ID ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`} strategy="afterInteractive" /> : null}
        <SiteHeader nav={dict.nav} locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter dict={dict.footer} cookies={dict.cookies} nav={dict.nav} locale={locale} />
        {trackingEnabled ? <ConsentBanner dict={dict.cookies} privacyHref={privacyUrl(locale)} /> : null}
      </body>
    </html>
  );
}
