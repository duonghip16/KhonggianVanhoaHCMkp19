'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { EditorialRecord } from '@/lib/editorial'

import { StatusTag } from './Chrome'
import type { CommunityStory } from '@/data/community-stories'
import StoryPhoto from './StoryPhoto'
import StoryDialog from './StoryDialog'
export default function StoryGrid({ stories, media }: { stories: CommunityStory[]; media: EditorialRecord[] }) {
  const [category, setCategory] = useState('Tất cả'), [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CommunityStory | null>(null)
  const openStory = (event: React.MouseEvent<HTMLAnchorElement>, item: CommunityStory) => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); setSelected(item) }
  const categories = ['Tất cả', ...Array.from(new Set(stories.map(item => item.category)))]
  const visible = stories.filter(item => (category === 'Tất cả' || item.category === category) && `${item.title} ${item.text} ${item.category}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLocaleLowerCase('vi').includes(search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLocaleLowerCase('vi')))
  return <><label className="library-search">Tìm câu chuyện<input type="search" placeholder="Một chủ đề, một việc tốt…" value={search} onChange={event => setSearch(event.target.value)} /></label><div className="chips" role="group" aria-label="Chủ đề câu chuyện">{categories.map(item => <button className="chip" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="stories" aria-live="polite">{visible.map((item, index) => <article key={item.id} className={'story' + (index === 0 ? ' big' : '')}><Link className="story-photo-link" aria-haspopup="dialog" onClick={event => openStory(event, item)} href={`/cau-chuyen/${encodeURIComponent(item.id!)}`} aria-label={`Đọc: ${item.title}`}><StoryPhoto story={item} media={media} /></Link><Link aria-haspopup="dialog" onClick={event => openStory(event, item)} href={`/cau-chuyen/${encodeURIComponent(item.id!)}`}><small>{item.category}{item.date && ` · ${item.date}`}</small><h2>{item.title}</h2><p>{item.introduction || item.text.slice(0, 180)}{!item.introduction && item.text.length > 180 ? '…' : ''}</p>{!item.localImage && <StatusTag s={item.status} />}<i>Đọc câu chuyện ↗</i></Link></article>)}{!visible.length && <div className="editorial-empty"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg><h3>{stories.length ? 'Chưa tìm thấy câu chuyện phù hợp.' : 'Những câu chuyện đang chờ được kể.'}</h3><p>{stories.length ? 'Thử một từ khóa hoặc chủ đề khác.' : 'Câu chuyện của Khu phố 19 sẽ xuất hiện sau khi tư liệu được xác minh và duyệt đăng.'}</p><Link className="btn dark" href="/vuon-hoa-viec-tot">Gửi một việc tốt ↗</Link></div>}</div>{selected && <StoryDialog key={selected.id} story={selected} media={media} onDismiss={() => setSelected(null)} />}</>
}
