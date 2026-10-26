import { SITE_ORIGIN } from '@/data/site'
export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || SITE_ORIGIN
  if (!value) return null
  try { const url = new URL(value); return url.protocol === 'https:' ? url.origin : null } catch { return null }
}
