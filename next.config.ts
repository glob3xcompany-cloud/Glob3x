import type { NextConfig } from "next";

/** Baseline hardening headers, sent with every response. HSTS is apex-only on purpose: mail and other subdomains are not ours to pin. */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      { source: "/:lang/projects/reeds-towers", destination: "/:lang/towers/reeds-towers", permanent: true },
      // Reeds Towers pages live under /reeds. Links to them were shared without the prefix for a while
      // (the unit selector used to write them that way), so they are sent to the right place; the query string travels along.
      { source: "/:lang(en|sq)/:slug(units|residences|architecture|location|company)", destination: "/reeds/:lang/:slug", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
