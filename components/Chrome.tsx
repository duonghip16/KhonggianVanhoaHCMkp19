import { SITE_NAME } from '@/data/site'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from './Navigation'
import ShareTools from './ShareTools'
import { STATUS_LABEL, type Status } from '@/data/content'

export function SubHeader() {
  return (
    <header className="nav solid"><Brand />
      <Navigation /></header>
  )
}
export function SiteFooter() {
  const explore = [
    ['/ve-bac', 'Về Bác'], ['/hoc-va-lam-theo-bac', 'Học & làm theo Bác'],
    ['/khu-pho-19', 'Khu phố 19'], ['/thu-vien', 'Thư viện số'],
  ] as const
  const participate = [
    ['/cau-chuyen', 'Những câu chuyện đẹp'], ['/vuon-hoa-viec-tot', 'Vườn hoa việc tốt'],
    ['/tuong-tac', 'Tương tác'],
  ] as const
  return <footer className="site-footer"><div className="footer-inner">
    <div className="footer-invitation">
      <div><p className="footer-eyebrow">Từ hiểu biết đến hành động</p><h2>Lan tỏa giá trị tốt đẹp.<br /><span>Thực hành theo Bác.</span></h2></div>
      <Link className="footer-cta" href="/tuong-tac">Cùng lan tỏa <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
    </div>
    <div className="footer-main">
      <div className="footer-identity"><Brand /><p className="footer-description">Cùng tìm hiểu về Bác, khám phá tư liệu và thực hành những giá trị tốt đẹp mỗi ngày.</p><p className="footer-location">Phường Tân Thới Hiệp<br />Thành phố Hồ Chí Minh</p></div>
      {[{ label: 'Khám phá', links: explore }, { label: 'Cùng tham gia', links: participate }].map(({ label, links }) => <nav className="footer-nav" aria-label={label} key={label}><h3>{label}</h3><ul>{links.map(([href, text]) => <li key={href}><Link href={href}>{text}</Link></li>)}</ul></nav>)}
      <div className="footer-connect"><h3>Kết nối & chia sẻ</h3><p>Chia sẻ không gian này hoặc gửi mã QR để cùng lan tỏa những giá trị đẹp.</p><ShareTools qr /></div>
    </div>
    <div className="footer-bottom"><span className="footer-copyright">© {new Date().getUTCFullYear()} Khu phố 19<span className="footer-copyright-note"> · {SITE_NAME}</span></span><div className="footer-bottom-links"><a className="footer-back-top" href="#">Về đầu trang <span aria-hidden="true">↑</span></a></div></div>
  </div></footer>
}
export function Brand() {
  return <Link href="/" className="brand" aria-label={SITE_NAME}><Image src="/logos/LOGO_KP19-transparent.png" width={44} height={44} alt="Logo Khu phố 19" /><b className="brand-wordmark"><span className="brand-overline">Không gian Văn hóa</span><span className="brand-title">Hồ Chí Minh <span className="brand-district">- KP19</span></span></b></Link>
}
export function StatusTag({ s }: { s: Status }) { return <span className={'st st-' + s}>{STATUS_LABEL[s]}</span> }
