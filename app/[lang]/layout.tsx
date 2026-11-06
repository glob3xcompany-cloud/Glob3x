import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isCoreLocale, isLocale, isRtl, locales, ogLocale } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
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
    metadataBase: new URL(site.domain),
    title: { default: dict.site.title, template: `%s | ${dict.site.name}` },
    description: dict.site.description,
    keywords: [...dict.site.keywords],
    applicationName: dict.site.name,
    authors: [{ name: site.company, url: site.domain }],
    creator: site.company,
    publisher: site.company,
    category: "construction",
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
      ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
    },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      siteName: dict.site.name,
      images: [{ url: "/media/projects/reeds-towers/hero-poster.jpg", width: 1600, height: 792 }],
    },
    twitter: { card: "summary_large_image", title: dict.site.title, description: dict.site.description },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const machine = !isCoreLocale(locale);

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationJsonLd(locale, [...dict.site.keywords]), websiteJsonLd(locale, dict.site.name, dict.site.description)]} />
        <SiteHeader nav={dict.nav} locale={locale} />
        <main className="flex-1">{children}</main>
        {machine ? (
          <p className="border-t border-line bg-paper-2 px-5 py-3 text-center text-[0.75rem] text-muted" role="note">
            {dict.nav.machineTranslated}
          </p>
        ) : null}
        <SiteFooter dict={dict.footer} nav={dict.nav} names={dict.projects.items} locale={locale} />
      </body>
    </html>
  );
}
