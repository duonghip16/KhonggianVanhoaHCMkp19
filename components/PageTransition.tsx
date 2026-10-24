'use client'
import { usePathname } from 'next/navigation'
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return <div key={path} className={path.startsWith('/admin') ? '' : 'page-enter'}>{children}</div>
}
