import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  if (process.env.VERCEL_ENV === 'preview') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }, ...(base ? { sitemap: `${base}/sitemap.xml` } : {}) }
}
