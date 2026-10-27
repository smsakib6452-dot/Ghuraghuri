import type { NextConfig } from "next";

const cspCommon = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://images.unsplash.com https://i.ytimg.com",
  "connect-src 'self' https://api.open-meteo.com https://router.project-osrm.org https://nominatim.openstreetmap.org",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
];

const cspNextPages = [
  ...cspCommon,
  "script-src 'self' 'unsafe-inline'",
].join("; ");

const cspChattogram = [
  ...cspCommon,
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
].join("; ");

const globalSecurityHeaders = [
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
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/destinations/sreemangal",
        destination: "/destinations/srimangal",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/chattogram",
        destination: "/chattogram.html",
      },
    ];
  },
  async headers() {
    return [
      // 1. Global Security Headers for all routes
      {
        source: "/:path*",
        headers: globalSecurityHeaders,
      },
      // 2. CSP Report-Only for all Next.js pages (excluding chattogram)
      {
        source: "/((?!chattogram|css|js|data|assets).*)",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspNextPages,
          },
        ],
      },
      // 3. CSP Report-Only for Chattogram Studio (includes cdnjs.cloudflare.com for jsPDF)
      {
        source: "/chattogram",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspChattogram,
          },
        ],
      },
      {
        source: "/chattogram.html",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspChattogram,
          },
        ],
      },
      // 4. Caching Fix for unhashed static assets
      {
        source: "/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/js/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
