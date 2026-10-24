'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { LibItem } from '@/data/content'
import HistoricalPhoto from './HistoricalPhoto'
import LibraryMediaViewer from './LibraryMediaViewer'

export default function ReadingDialog({ preview, onDismiss }: { preview: LibItem | null; onDismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (preview && !dialog.current?.open) { dialog.current?.showModal(); if (dialog.current) dialog.current.scrollTop = 0 }
    else if (!preview && dialog.current?.open) dialog.current.close()
  }, [preview, mounted])
  useEffect(() => {
    if (!preview) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [preview])
  if (!mounted) return null
  return createPortal(
    <dialog className="library-preview" ref={dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onDismiss() }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss() } }}>
      <div className="library-preview-bar"><span>{preview?.image ? 'Ảnh tư liệu' : 'Phòng đọc · Thư viện số'}</span><button type="button" onClick={() => onDismiss()} aria-label="Đóng tư liệu">Đóng <span aria-hidden="true">×</span></button></div>
      {preview?.image && <div className="library-preview-content"><h2 id={titleId}>{preview.title}</h2><HistoricalPhoto image={preview.image} className="library-preview-photo" sizes="(max-width: 800px) 88vw, 880px" /><div className="library-preview-actions"><a className="btn dark" href={preview.image.src} download={`${preview.id}.webp`}>Tải ảnh <span aria-hidden="true">↓</span></a><a href={preview.url} target="_blank" rel="noopener noreferrer">Xem hồ sơ ảnh tại nguồn ↗</a></div></div>}
      {preview && !preview.image && <article className="library-preview-content library-reader">
        <p className="eyebrow">{preview.type}</p><h2 id={titleId}>{preview.title}</h2>
        {preview.media && <LibraryMediaViewer key={preview.id} media={preview.media} title={preview.title} />}
        {preview.reading ? <>
          <p className="library-reader-note">Bản đọc biên soạn theo tư liệu nguồn.</p>
          {preview.reading.sections.length >= 5 && <nav className="library-reader-toc" aria-label="Mục lục bài đọc"><p className="eyebrow">Mục lục · {preview.reading.sections.length} phần</p><ol>{preview.reading.sections.map((section, index) => <li key={section.title}><button type="button" onClick={() => { const target = document.getElementById(`${titleId}-section-${index}`); target?.scrollIntoView({ block: 'start' }); target?.focus({ preventScroll: true }) }}>{section.title}</button></li>)}</ol></nav>}
          <div className="library-reader-layout"><div className="library-reader-body">{preview.reading.sections.map((section, index) => <section key={section.title} id={`${titleId}-section-${index}`} tabIndex={-1}><h3>{section.title}</h3>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.image && <HistoricalPhoto image={section.image} className="library-reader-inline-photo" sizes="(max-width: 800px) 85vw, 580px" />}{section.source && <div className="library-section-source"><span>Nguồn đối chiếu</span>{[section.source, ...(section.references ?? [])].map(reference => <a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label} ↗</a>)}</div>}</section>)}</div>
          <aside className="library-reader-image"><p className="eyebrow">Ảnh tư liệu liên quan</p><HistoricalPhoto image={preview.reading.image} sizes="(max-width: 800px) 85vw, 300px" /></aside></div>
        </> : <div className="library-reader-body">{preview.description ? preview.description.split(/\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>) : !preview.media && <p>Nội dung đọc đang được cập nhật.</p>}
          {preview.type === 'Audio' && /\.(mp3|wav|ogg|m4a|aac)(?:[?#]|$)/i.test(preview.url) && <audio controls preload="none" src={preview.url} aria-label={preview.title} />}
          {preview.type === 'Video' && /\.(mp4|webm|ogv)(?:[?#]|$)/i.test(preview.url) && <video controls preload="metadata" src={preview.url} aria-label={preview.title} />}
        </div>}
        <footer className="library-reader-source"><p>Nguồn tham khảo: {preview.source}</p><a href={preview.url} target="_blank" rel="noopener noreferrer">Xem tư liệu gốc tại nguồn <span aria-hidden="true">↗</span></a>{preview.references?.map(reference => <p key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label} ↗</a></p>)}</footer>
      </article>}
    </dialog>, document.body
  )
}
