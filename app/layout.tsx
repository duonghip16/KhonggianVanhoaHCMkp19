import { SITE_NAME } from '@/data/site'
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import './responsive.css'
import PageTransition from '@/components/PageTransition'
import LotusSymbol from '@/components/LotusSymbol'
import { siteUrl } from '@/lib/site-url'

const bvp = Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['300', '400', '500', '700', '800'], variable: '--font-bvp', display: 'swap' })

export const metadata: Metadata = {
  ...(process.env.VERCEL_ENV === 'preview' ? { robots: { index: false, follow: false } } : {}),
  icons: {
    icon: { url: '/logos/LOGO_KP19-transparent.png', type: 'image/png' },
    shortcut: '/logos/LOGO_KP19-transparent.png',
    apple: '/logos/LOGO_KP19-transparent.png',
  },
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: 'Triển lãm số: từ tư tưởng, giá trị đến những việc làm bình dị của cộng đồng Khu phố 19, phường Tân Thới Hiệp.',
  ...(siteUrl() ? { metadataBase: new URL(siteUrl()!) } : {}),
  openGraph: { locale: 'vi_VN', type: 'website', title: SITE_NAME, description: 'Lan tỏa giá trị tốt đẹp, thực hành theo Bác.', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: SITE_NAME, images: ['/opengraph-image'] },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#641421' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = siteUrl()
  return (<html lang="vi" className={bvp.variable}><body><LotusSymbol />{base && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: base, inLanguage: 'vi' }).replace(/</g, '\\u003c') }} />}<PageTransition>{children}</PageTransition></body></html>)
}
