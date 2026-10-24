import Link from 'next/link'
import { SiteFooter, SubHeader } from './Chrome'
export function PageHero({ eyebrow, title, description, tone = 'burgundy' }: { eyebrow: string; title: string; description: string; tone?: 'burgundy' | 'emerald' }) {
  return <section className={`page-hero grain ${tone}`}><div className="page-hero-art" aria-hidden="true"><svg viewBox="0 0 100 100"><use href="#kp19-lotus" /></svg></div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lede">{description}</p><Link className="hero-discover" href="#noi-dung">Tiếp tục khám phá <span aria-hidden="true">↓</span></Link></section>
}
export default function ExhibitionPage({ children, eyebrow, title, description, tone }: React.ComponentProps<typeof PageHero> & { children: React.ReactNode }) {
  return <><SubHeader /><main id="main"><PageHero eyebrow={eyebrow} title={title} description={description} tone={tone} /><div id="noi-dung" className="exhibition-content">{children}</div></main><SiteFooter /></>
}
export function NextChapter({ href, label, title }: { href: string; label: string; title: string }) {
  return <section className="next-chapter"><p className="eyebrow">{label}</p><Link href={href}>{title}<span aria-hidden="true">↗</span></Link></section>
}
