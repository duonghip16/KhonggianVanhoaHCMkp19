'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { LibraryMedia } from '@/data/library-multimedia'

function EmbeddedMedia({ src, title, video = false }: { src: string; title: string; video?: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'slow'>('loading')
  useEffect(() => {
    const timer = window.setTimeout(() => setState(current => current === 'loading' ? 'slow' : current), 15000)
    return () => window.clearTimeout(timer)
  }, [])
  return <>
    {state !== 'ready' && <p role="status">{state === 'loading' ? 'Đang mở trình xem tư liệu…' : 'Trình xem chưa phản hồi. Bạn có thể mở tư liệu ở tab mới hoặc đóng và thử lại.'}</p>}
    <iframe className={video ? undefined : 'library-pdf'} src={src} title={title} onLoad={() => setState('ready')} onError={() => setState('slow')} allow={video ? 'encrypted-media; picture-in-picture; fullscreen' : undefined} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={video} />
  </>
}

export default function LibraryMediaViewer({ media, title }: { media: LibraryMedia; title: string }) {
  const [page, setPage] = useState(1)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  return <div key={attempt} className={`library-media-viewer library-media-${media.kind}`}>
    {media.kind === 'image' && <><Image src={media.src} alt={media.alt} width={1200} height={900} unoptimized onError={() => setFailed(true)} /><p className="library-media-credit">{media.credit}</p></>}
    {media.kind === 'pdf' && <><EmbeddedMedia src={media.src} title={`Đọc ${title}`} /><p className="library-media-credit">{media.credit}</p><p>Nếu thiết bị chưa hỗ trợ xem PDF, bạn có thể <a href={media.src} target="_blank" rel="noopener noreferrer">mở tệp PDF</a> hoặc <a href={media.src} download>tải về để đọc</a>.</p></>}
    {media.kind === 'book-guide' && <><div className="book-guide-header"><Image src={media.src} alt={`Bìa hồ sơ giới thiệu ${title}, do Khu phố 19 thiết kế`} width={600} height={840} unoptimized onError={() => setFailed(true)} /><div><p className="eyebrow">Hồ sơ tác phẩm</p><p className="book-guide-author">{media.author}</p><p>{media.period}</p><p className="book-guide-label">Bản đọc giới thiệu · Trang biên soạn</p></div></div><p className="library-media-credit">{media.credit}</p></>}
    {media.kind === 'book' && <>
      <div className="book-toolbar"><div><button type="button" disabled={page === 1} onClick={() => { setPage(page - 1); setFailed(false) }} aria-label="Trang trước">←</button><label>Trang <select value={page} onChange={event => { setPage(Number(event.target.value)); setFailed(false) }} aria-label="Chọn trang sách">{Array.from({ length: media.pages }, (_, index) => <option value={index + 1} key={index}>{index + 1}</option>)}</select><span>/ {media.pages}</span></label><button type="button" disabled={page === media.pages} onClick={() => { setPage(page + 1); setFailed(false) }} aria-label="Trang sau">→</button></div><a href={media.src} download>Tải PDF ↓</a></div>
      <p className="book-page-status" role="status" aria-live="polite">Bản quét gốc · Trang {page} / {media.pages}</p>
      <Image key={page} src={page === 1 ? '/books/duong-kach-menh-cover.jpg' : media.pageImageTemplate.replace('{page}', String(page))} alt={`${title} — trang ${page} của bản quét`} width={960} height={1344} unoptimized onError={() => setFailed(true)} />
      <p className="library-media-credit">{media.credit}<br /><a href={media.licenseUrl} target="_blank" rel="noopener noreferrer">{media.license} ↗</a></p>
    </>}
    {media.kind === 'video' && <>{media.provider === 'youtube' ? <EmbeddedMedia src={media.src} title={title} video /> : <video controls playsInline preload="metadata" src={media.src} aria-label={title} onError={() => setFailed(true)} />}<p className="library-media-credit">{media.credit}</p><p>Nếu video không phát, <a href={media.src} target="_blank" rel="noopener noreferrer">mở video ở tab mới ↗</a>.</p></>}
    {media.kind === 'audio' && <><div className="audio-stage"><svg viewBox="0 0 120 60" aria-hidden="true"><path d="M10 25v10M20 15v30M30 20v20M40 5v50M50 15v30M60 0v60M70 20v20M80 10v40M90 15v30M100 25v10M110 20v20" fill="none" stroke="currentColor" strokeWidth="3" /></svg><p>Chương trình phát thanh</p><audio controls preload="metadata" src={media.src} aria-label={title} onError={() => setFailed(true)} /></div><p className="library-media-credit">{media.credit}</p></>}
    {media.kind === 'infographic' && <><Image src={media.src} alt={media.alt} width={media.width} height={media.height} unoptimized onError={() => setFailed(true)} /><p className="library-media-credit">{media.credit}</p><a className="btn dark" href={media.src} download>Tải infographic ↓</a></>}
    {failed && <div className="library-media-error" role="alert"><p>Tư liệu tạm thời chưa tải được. {media.kind === 'book' ? <a href={media.src} download>Bạn có thể tải PDF để đọc đầy đủ.</a> : 'Bạn có thể thử lại hoặc kiểm tra tại liên kết nguồn bên dưới.'}</p><button type="button" className="btn dark" onClick={() => { setFailed(false); setAttempt(value => value + 1) }}>Thử tải lại tư liệu</button></div>}
  </div>
}
