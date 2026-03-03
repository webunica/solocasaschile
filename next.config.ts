import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Compression ─────────────────────────────────────────────────────────
  compress: true,

  // ─── Image Optimization ──────────────────────────────────────────────────
  images: {
    // Allow remote images from these hostnames
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "**.sanity.io" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "**.ibb.co" },
      // Catch-all for any other https sources used in DB image_urls
      { protocol: "https", hostname: "**" },
    ],
    // Enable modern image formats
    formats: ["image/avif", "image/webp"],
    // Largest breakpoints used in the app
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    // Minimize layout shift by keeping a small cache TTL floor
    minimumCacheTTL: 3600,
  },

  // ─── Experimental features ───────────────────────────────────────────────
  experimental: {
    // Optimize package imports to reduce Client JS bundle size
    optimizePackageImports: ["lucide-react"],
  },

  // ─── HTTP Headers ─────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Tell browsers / CDNs they can cache static pages for 1 hour and then
          // serve stale while revalidating in the background.
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
          // Basic security hardening
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Preconnect hint for Google Fonts (Nunito)
          {
            key: "Link",
            value:
              "<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin",
          },
        ],
      },
      // Long-lived cache for all static assets
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache optimized images for 7 days
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
