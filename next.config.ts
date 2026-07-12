import type { NextConfig } from 'next'

const defaultFrameAncestors =
  "'self' https://sidhu-finanzen.de https://www.sidhu-finanzen.de"

const frameAncestors = process.env.ALLOWED_IFRAME_ANCESTORS ?? defaultFrameAncestors
const isProduction = process.env.NODE_ENV === 'production'

const scriptSrc = isProduction
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'"

const connectSrc = isProduction
  ? "connect-src 'self' https:"
  : "connect-src 'self' https: http: ws: wss:"

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  connectSrc,
  `frame-ancestors ${frameAncestors}`,
].join('; ')

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/embed/properties',
        destination: '/immobilien/kaufen',
        permanent: true,
      },
      {
        source: '/embed/properties/:propertyId',
        destination: '/immobilien/kaufen/:propertyId',
        permanent: true,
      },
      {
        source: '/immobilien/:propertyId(\\d+)',
        destination: '/immobilien/kaufen/:propertyId',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
