import Link from 'next/link'
import { SubHeader, SiteFooter } from '@/components/Chrome'
export default function NotFound() {
  return <><SubHeader /><main id="main" className="not-found"><p className="eyebrow">404 · Trang chưa có trong triển lãm</p><h1>Chúng ta tìm<br />một lối đi khác.</h1><p>Đường dẫn có thể đã thay đổi hoặc nội dung chưa được công bố.</p><div className="more"><Link className="btn dark" href="/">Về trang chủ ↗</Link><Link className="btn dark" href="/thu-vien">Khám phá thư viện</Link></div></main><SiteFooter /></>
}
