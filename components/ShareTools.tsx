'use client'
import { SITE_NAME } from '@/data/site'
import { useState } from 'react'
import Image from 'next/image'
export default function ShareTools({ title = SITE_NAME, qr = false }: { title?: string; qr?: boolean }) {
  const [message, setMessage] = useState(''), [qrImage, setQrImage] = useState(''), [busy, setBusy] = useState(false)
  const url = () => window.location.origin + window.location.pathname + window.location.search + window.location.hash
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`, url: url() })
      else { await navigator.clipboard.writeText(url()); setMessage('Đã sao chép đường dẫn.') }
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage('Bạn có thể chia sẻ bằng đường dẫn trong thanh địa chỉ.') }
  }
  async function makeQr() {
    if (qrImage) { setQrImage(''); return }
    setBusy(true); setMessage('')
    try {
      const QRCode = await import('qrcode')
      const target = new URL('/?source=qr', process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
      setQrImage(await QRCode.toDataURL(target.toString(), { width: 512, margin: 4, color: { dark: '#063f3a', light: '#ffffff' } }))
    } catch { setMessage('Chưa tạo được QR. Vui lòng thử lại.') }
    finally { setBusy(false) }
  }
  return <div className="share-tools"><div><button type="button" className="share-button" onClick={share}>Chia sẻ ↗</button>{qr && <button type="button" className="share-button" onClick={makeQr} disabled={busy} aria-expanded={!!qrImage}>{busy ? 'Đang tạo…' : 'Mã QR'}</button>}</div>{qrImage && <div className="qr-card"><Image src={qrImage} unoptimized width={180} height={180} alt={`Mã QR mở ${SITE_NAME}`} /><a href={qrImage} download="qr-khu-pho-19.png">Tải mã QR PNG ↓</a></div>}<p className="share-status" role="status">{message}</p></div>
}
