'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const explore = [['/ve-bac', 'Về Bác'], ['/hoc-va-lam-theo-bac', 'Học & làm theo Bác'], ['/thu-vien', 'Thư viện số']] as const
const community = [['/khu-pho-19', 'Khu phố 19'], ['/cau-chuyen', 'Những câu chuyện đẹp'], ['/vuon-hoa-viec-tot', 'Vườn hoa việc tốt'], ['/tuong-tac', 'Tương tác']] as const
const paths: Record<string, string> = {
  '/': 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  '/ve-bac': 'M12 3v3m-6 1 2 2m10-2-2 2M8 14a5 5 0 1 1 8 0l-2 3h-4l-2-3Zm2 6h4',
  '/hoc-va-lam-theo-bac': 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm9 3a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3',
  '/thu-vien': 'M4 4h4v16H4V4Zm6 0h4v16h-4V4Zm6 1 4-1 3 15-4 1-3-15Z',
  '/khu-pho-19': 'M3 21V8l6-4 6 4v13M15 11l6-3v13M1 21h22M7 10h4m-4 4h4m-4 4h4m7-4h1m-1 4h1',
  '/cau-chuyen': 'M4 4h16v13H9l-5 4V4Zm4 5h8m-8 4h5',
  '/vuon-hoa-viec-tot': 'M12 21v-7m0 4c-5 0-8-3-8-6 4 0 7 2 8 6Zm0-4c5 0 8-3 8-6-4 0-7 2-8 6Zm0 0c-4-3-4-7 0-11 4 4 4 8 0 11Z',
  '/tuong-tac': 'M7 3 4 7l3 4m10 2 3 4-3 4M4 7h12a4 4 0 0 1 4 4M20 17H8a4 4 0 0 1-4-4',
}
function NavIcon({ href }: { href: string }) {
  return <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[href]} /></svg>
}
export default function Navigation() {
  const pathname = usePathname()
  const menu = useRef<HTMLDetailsElement>(null)
  const desktopMenu = useRef<HTMLDetailsElement>(null)
  const [opened, setOpened] = useState(false)
  const active = (href: string) => href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  const close = () => { if (menu.current) menu.current.open = false; if (desktopMenu.current) desktopMenu.current.open = false }
  useEffect(() => { if (menu.current) menu.current.open = false; if (desktopMenu.current) desktopMenu.current.open = false }, [pathname])
  useEffect(() => {
    // Touch browsers can blur the summary before dispatching a link's click.
    // Close on an actual outside interaction so the link stays available.
    const dismiss = (event: Event) => { for (const element of [menu.current, desktopMenu.current]) if (element && !element.contains(event.target as Node)) element.open = false }
    const desktop = matchMedia('(min-width: 1101px)')
    const resize = () => { if (menu.current) menu.current.open = false; if (desktopMenu.current) desktopMenu.current.open = false }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', dismiss)
    desktop.addEventListener('change', resize)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('focusin', dismiss); desktop.removeEventListener('change', resize) }
  }, [])
  const item = ([href, label]: readonly [string, string], icon = false) => <li key={href}><Link href={href} aria-current={active(href) ? 'page' : undefined} onClick={close}>{icon && <NavIcon href={href} />}<span>{label}</span>{icon && <span className="nav-item-arrow" aria-hidden="true">↗</span>}</Link></li>
  const keyboard = (event: React.KeyboardEvent<HTMLDetailsElement>) => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }
  return <>
    <nav className="desktop-nav" aria-label="Chính"><ul>{item(['/', 'Trang chủ'])}{explore.map(link => item(link))}<li><details ref={desktopMenu} className="desktop-community" onKeyDown={keyboard}><summary className={community.some(([href]) => active(href)) ? 'is-current' : undefined}>Cộng đồng <span className="nav-chevron" aria-hidden="true">⌄</span></summary><ul>{community.map(link => item(link, true))}</ul></details></li></ul></nav>
    <details ref={menu} className="mobile-menu" onToggle={event => setOpened(event.currentTarget.open)} onKeyDown={keyboard}>
      <summary aria-label={opened ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}><span className="menu-icon" aria-hidden="true" /><span>{opened ? 'Đóng' : 'Menu'}</span></summary>
      <nav aria-label="Chính trên điện thoại"><p className="mobile-menu-heading">Khám phá không gian <span>KP19</span></p><ul className="mobile-home-link">{item(['/', 'Trang chủ'], true)}</ul><div className="mobile-menu-group"><p className="mobile-group-label">Tìm hiểu & khám phá</p><ul>{explore.map(link => item(link, true))}</ul></div><div className="mobile-menu-group"><p className="mobile-group-label">Cộng đồng & sẻ chia</p><ul>{community.map(link => item(link, true))}</ul></div></nav>
    </details>
  </>
}
