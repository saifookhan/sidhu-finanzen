import type { NextConfig } from "next";

const defaultDevAncestors = [
  "'self'",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const defaultProdAncestors = [
  "'self'",
  "https://sidhu-finanzen.de",
  "https://www.sidhu-finanzen.de",
];

const isProduction = process.env.NODE_ENV === "production";

const extraAncestors = (process.env.ALLOWED_IFRAME_ANCESTORS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const frameAncestors = [
  ...(isProduction ? defaultProdAncestors : defaultDevAncestors),
  ...extraAncestors,
].join(" ");

const scriptSrc = isProduction
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const connectSrc = isProduction
  ? "connect-src 'self' https:"
  : "connect-src 'self' https: http: ws: wss:";

const contentSecurityPolicy = [
  "default-src 'self' http://localhost:5500 http://127.0.0.1:5500",
  "base-uri 'self'",
  "object-src 'none'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  connectSrc,
  "frame-src 'self' https://www.openstreetmap.org",
  `frame-ancestors ${frameAncestors}`,
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/embed/properties",
        destination: "/immobilien/kaufen",
        permanent: true,
      },
      {
        source: "/embed/properties/:propertyId",
        destination: "/immobilien/kaufen/:propertyId",
        permanent: true,
      },
      {
        source: "/immobilien/:propertyId(\\d+)",
        destination: "/immobilien/kaufen/:propertyId",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
