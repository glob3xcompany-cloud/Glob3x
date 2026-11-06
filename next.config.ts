import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Served as a section of the group website at glob3x.com/reeds; keep in sync with BASE_PATH in lib/site.ts. */
  basePath: "/reeds",
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/:lang(en|sq)/developer", destination: "/:lang/company", permanent: true }];
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
