import { SITE_NAME } from '@/data/site'
import { notFound } from 'next/navigation'
import { SubHeader, SiteFooter, StatusTag } from '@/components/Chrome'
import { loadStories } from '@/lib/stories'
import StoryPhoto from '@/components/StoryPhoto'
import DocumentaryMedia from '@/components/DocumentaryMedia'
import type { Metadata } from 'next'
import ShareTools from '@/components/ShareTools'
import { chapterMetadata } from '@/lib/metadata'
import SourceReference from '@/components/SourceReference'
import { displayDate } from '@/lib/date'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = (await loadStories()).stories.find(item => item.id === slug)
  const image = `/cau-chuyen/${encodeURIComponent(slug)}/opengraph-image`
  return story ? { ...chapterMetadata(story.title, story.text.slice(0, 160), `/cau-chuyen/${encodeURIComponent(slug)}`), openGraph: { title: `${story.title} · ${SITE_NAME}`, description: story.text.slice(0, 160), images: [{ url: image, width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image', title: `${story.title} · ${SITE_NAME}`, images: [image] } } : { title: 'Không tìm thấy câu chuyện', robots: { index: false } }
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { stories, media } = await loadStories()
  const s = stories.find(x => x.id === slug); if (!s) notFound()
  return (<><SubHeader />
    <main id="main" className="sub on-light"><article>
      <div className="story-detail-photo"><StoryPhoto story={s} media={media} priority /></div>
      <div className="col"><p className="eyebrow">{s.category}</p><h1 className="h2">{s.title}</h1>{!s.localImage && <StatusTag s={s.status} />}{s.introduction && <p className="story-introduction">{s.introduction}</p>}
        {!s.localImage && <p>Ngày sự kiện: {displayDate(s.date)} · Xác minh: {s.verifiedBy}, {displayDate(s.verifiedOn)}</p>}
        <ShareTools title={s.title} />
        {s.text.split('\n').filter(Boolean).map((p, i) => <p key={i} className="body">{p}</p>)}
        <div className="story-gallery">{media.filter(item => item.category === `gallery:${s.id}`).map(item => <DocumentaryMedia key={item.id} item={item} />)}</div>
        {s.takeaway && <aside className="story-takeaway"><p className="eyebrow">Một điều mang theo</p><p>{s.takeaway}</p></aside>}<aside className="refs"><h2>Nguồn tham khảo</h2><p><SourceReference text={s.source} /></p></aside>
        <div className="more"><Link className="btn dark" href="/cau-chuyen">Những câu chuyện khác →</Link><Link href="/vuon-hoa-viec-tot">Góp một việc tốt →</Link></div></div>
    </article></main><SiteFooter /></>)
}
