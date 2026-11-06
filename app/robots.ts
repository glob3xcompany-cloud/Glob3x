import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const host = site.domain.replace(/^https?:\/\//, "");
  return {
    rules: [
      // Google and Bing read the richest version of the page; everything else gets the same rules anyway.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: [`${site.domain}/sitemap.xml`, `${site.domain}/reeds/sitemap.xml`],
    host,
  };
}
