'use client'
import Link from 'next/link'
import { SubHeader, SiteFooter } from '@/components/Chrome'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <><SubHeader /><main id="main" className="not-found"><p className="eyebrow">Kết nối bị gián đoạn</p><h1>Chương này chưa mở được.</h1><p>Bạn có thể thử tải lại để tiếp tục tham quan.</p><div className="more"><button className="btn dark" onClick={reset}>Thử lại</button><Link className="btn dark" href="/">Về trang chủ</Link></div></main><SiteFooter /></>
}
