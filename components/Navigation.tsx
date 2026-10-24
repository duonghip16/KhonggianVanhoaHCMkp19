'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const links = [['/', 'Trang chủ'], ['/ve-bac', 'Về Bác'], ['/hoc-va-lam-theo-bac', 'Học & làm theo Bác'], ['/khu-pho-19', 'Khu phố 19'], ['/thu-vien', 'Thư viện số'], ['/tuong-tac', 'Tương tác']] as const
export default function Navigation() {
  const pathname = usePathname()
  const list = <ul>{links.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link></li>)}</ul>
  return <><nav className="desktop-nav" aria-label="Chính">{list}</nav><details className="mobile-menu" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}><summary>Menu</summary><nav aria-label="Chính trên điện thoại" onClick={event => { if ((event.target as HTMLElement).closest('a')) event.currentTarget.closest('details')?.removeAttribute('open') }}>{list}</nav></details></>
}
