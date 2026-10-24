import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'
import { loadPublishedCollections } from '@/lib/public-content'
import { mergeCommunityStories } from '@/data/community-stories'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl(); if (!base) return []
  const paths = ['', '/ve-bac', '/hoc-va-lam-theo-bac', '/khu-pho-19', '/cau-chuyen', '/vuon-hoa-viec-tot', '/thu-vien', '/tuong-tac']
  const { records: [stories] } = await loadPublishedCollections(['stories'])
  return [...paths.map(route => ({ url: base + route })), ...mergeCommunityStories(stories).map(item => ({ url: `${base}/cau-chuyen/${encodeURIComponent(item.id!)}` }))]
}
