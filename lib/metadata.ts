import { SITE_NAME } from '@/data/site'
import type { Metadata } from 'next'
import { siteUrl } from './site-url'
export function chapterMetadata(title: string, description: string, path: string): Metadata {
  const base = siteUrl()
  return { title, description, ...(base ? { alternates: { canonical: base + path } } : {}), openGraph: { title: `${title} · ${SITE_NAME}`, description, locale: 'vi_VN', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }], ...(base ? { url: base + path } : {}) }, twitter: { card: 'summary_large_image', title: `${title} · ${SITE_NAME}`, description, images: ['/opengraph-image'] } }
}
