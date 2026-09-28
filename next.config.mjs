// Limit optimization to this project's public catalog bucket, never arbitrary hosts.
const storageUrl = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null
const localIntegration = process.env.SOLEANDO_LOCAL_INTEGRATION === '1' && !process.env.VERCEL && storageUrl?.hostname === '127.0.0.1'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: storageUrl ? [{ protocol: storageUrl.protocol.slice(0, -1), hostname: storageUrl.hostname, port: storageUrl.port, pathname: '/storage/v1/object/public/soleando-media/**', search: '' }] : [],
    dangerouslyAllowLocalIP: localIntegration,
    maximumRedirects: 0,
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/(.*).(webp|jpg|jpeg|png|svg|ico|woff2|woff)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

export default nextConfig
