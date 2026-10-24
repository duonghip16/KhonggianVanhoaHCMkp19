'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
const links = [['/', 'Trang chủ'], ['/ve-bac', 'Về Bác'], ['/hoc-va-lam-theo-bac', 'Học & làm theo Bác'], ['/khu-pho-19', 'Khu phố 19'], ['/thu-vien', 'Thư viện số'], ['/tuong-tac', 'Tương tác']] as const
export default function Navigation() {
  const pathname = usePathname()
  const menu = useRef<HTMLDetailsElement>(null)
  useEffect(() => { if (menu.current) menu.current.open = false }, [pathname])
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false }
    const desktop = matchMedia('(min-width: 1101px)')
    const resize = () => { if (desktop.matches && menu.current) menu.current.open = false }
    document.addEventListener('pointerdown', dismiss)
    desktop.addEventListener('change', resize)
    return () => { document.removeEventListener('pointerdown', dismiss); desktop.removeEventListener('change', resize) }
  }, [])
  const list = <ul>{links.map(([href, label], index) => <li key={href}><Link href={href} aria-current={(href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)) ? 'page' : undefined}><span className="nav-link-number" aria-hidden="true">0{index + 1}</span><span>{label}</span><span className="nav-link-arrow" aria-hidden="true">↗</span></Link></li>)}</ul>
  return <><nav className="desktop-nav" aria-label="Chính">{list}</nav><details ref={menu} className="mobile-menu" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}><summary><span className="menu-icon" aria-hidden="true" />Menu</summary><nav aria-label="Chính trên điện thoại" onClick={event => { if ((event.target as HTMLElement).closest('a')) event.currentTarget.closest('details')?.removeAttribute('open') }}><p className="mobile-menu-heading">Khám phá không gian <span>KP19</span></p>{list}<div className="mobile-menu-extra"><Link href="/cau-chuyen">Những câu chuyện đẹp ↗</Link><Link href="/vuon-hoa-viec-tot">Góp một việc tốt ↗</Link></div></nav></details></>
}
