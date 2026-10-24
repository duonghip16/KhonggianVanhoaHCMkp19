'use client'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { CommunityStory } from '@/data/community-stories'
import type { EditorialRecord } from '@/lib/editorial'
import StoryPhoto from './StoryPhoto'
import DocumentaryMedia from './DocumentaryMedia'
import SourceReference from './SourceReference'

export default function StoryDialog({ story, media, onDismiss }: { story: CommunityStory; media: EditorialRecord[]; onDismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const previous = document.body.style.overflow
    const trigger = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; trigger?.focus() }
  }, [])
  return createPortal(<dialog ref={dialog} className="library-preview story-popup" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onDismiss() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss()
  }}>
    <div className="library-preview-bar"><span>Câu chuyện · Khu phố 19</span><button type="button" onClick={onDismiss} aria-label="Đóng câu chuyện" autoFocus>Đóng <span aria-hidden="true">×</span></button></div>
    <article className="library-preview-content library-reader">
      <p className="eyebrow">{story.category}</p><h2 id={titleId}>{story.title}</h2>
      {story.introduction && <p className="story-introduction">{story.introduction}</p>}
      <StoryPhoto story={story} media={media} />
      <div className="library-reader-body">{story.text.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {story.takeaway && <aside className="story-takeaway"><p className="eyebrow">Một điều mang theo</p><p>{story.takeaway}</p></aside>}
      <div className="story-gallery">{media.filter(item => item.category === `gallery:${story.id}`).map(item => <DocumentaryMedia key={item.id} item={item} />)}</div>
      <footer className="library-reader-source"><p><SourceReference text={story.source} /></p><Link href={`/cau-chuyen/${encodeURIComponent(story.id!)}`}>Mở trang riêng ↗</Link></footer>
    </article>
  </dialog>, document.body)
}
