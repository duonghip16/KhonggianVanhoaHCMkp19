import Image from 'next/image'
import type { LibItem } from '@/data/content'

export default function LibraryCover({ item }: { item: LibItem }) {
  const media = item.media
  if (!media) return null
  if (media.kind === 'book' || media.kind === 'book-guide') return <Image src={media.kind === 'book-guide' ? media.src : '/books/duong-kach-menh-cover.jpg'} alt={`Bìa ${item.title}`} width={960} height={1344} unoptimized />
  if (media.kind === 'image' || media.kind === 'infographic') return <Image src={media.src} alt={media.alt} width={media.kind === 'infographic' ? media.width : 1200} height={media.kind === 'infographic' ? media.height : 900} unoptimized />
  if (media.kind === 'video') return <>{item.reading?.image && <><Image src={item.reading.image.src} alt="Ảnh tư liệu liên quan đến video" width={item.reading.image.width} height={item.reading.image.height} sizes="(max-width: 700px) 85vw, 40vw" /><span className="media-cover-note">Ảnh tư liệu liên quan</span></>}<span className="media-play" aria-hidden="true">▶</span></>
  if (media.kind === 'pdf') return <><svg width="70" height="90" viewBox="0 0 32 40" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 2h15l7 7v29H5zM20 2v8h7M10 17h12M10 23h12M10 29h8" /></svg><span>Tài liệu PDF</span></>
  return <><svg className="media-wave" viewBox="0 0 120 60" aria-hidden="true"><path d="M10 25v10M20 15v30M30 20v20M40 5v50M50 15v30M60 0v60M70 20v20M80 10v40M90 15v30M100 25v10M110 20v20" fill="none" stroke="currentColor" strokeWidth="2" /></svg><span className="media-audio-label">{item.source}</span></>
}
