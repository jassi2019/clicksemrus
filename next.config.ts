import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async rewrites() {
    // IndexNow expects the key file at the site root: /<key>.txt
    return [{ source: "/:key([a-f0-9]{16,64}).txt", destination: "/indexnow/:key.txt" }];
  },
  async redirects() {
    // Legacy single-level service slugs that became sub-services under a category.
    const moved: Record<string, string> = {
      "google-ads-ppc": "/services/paid-ads/google-ads-ppc",
      "meta-ads": "/services/paid-ads/meta-ads",
      "content-marketing": "/services/social-media-marketing/content-marketing",
      "influencer-marketing": "/services/social-media-marketing/influencer-marketing",
      "whatsapp-email-marketing": "/services/automation-crm/whatsapp-email-marketing",
    };
    return Object.entries(moved).map(([from, destination]) => ({ source: `/services/${from}`, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
