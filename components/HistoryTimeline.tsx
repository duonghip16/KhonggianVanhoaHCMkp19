'use client'
import ReadingPopup from '@/components/ReadingPopup'
import { useId, useState } from 'react'
import { HISTORY } from '@/data/content'
import { HISTORICAL_IMAGES } from '@/data/historical-media'
import HistoricalPhoto from './HistoricalPhoto'

type Milestone = { date: string; title: string; text: string; source: string }
export default function HistoryTimeline({ entries = HISTORY }: { entries?: Milestone[] }) {
  const [selected, setSelected] = useState(0)
  const instanceId = useId()
  const panelId = `${instanceId}-panel`
  const entry = entries[selected]
  const photo = entry.date === '02/09/1945' ? HISTORICAL_IMAGES.independence : undefined
  return <section className="historical-exhibit on-light" aria-labelledby="history-title"><div className="bac-section-heading"><div><p className="eyebrow">Cuộc đời & hành trình</p><h2 id="history-title">Đi qua những dấu mốc.</h2></div><p>Chọn một năm để tìm hiểu sự kiện và mở bài đọc liên quan. Dòng thời gian khái quát những mốc được tuyển chọn từ tư liệu.</p></div><div className={`milestone-tabs${entries.length > 4 ? ' milestone-tabs-expanded' : ''}`} role="tablist" aria-label="Mốc lịch sử">{entries.map((item, index) => <button key={item.date} id={`${instanceId}-milestone-${index}`} role="tab" aria-selected={selected === index} aria-controls={panelId} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => { const next = event.key === 'ArrowRight' ? (index + 1) % entries.length : event.key === 'ArrowLeft' ? (index - 1 + entries.length) % entries.length : event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : null; if (next !== null) { event.preventDefault(); setSelected(next); document.getElementById(`${instanceId}-milestone-${next}`)?.focus() } }}>{item.date.slice(-4)}</button>)}</div><div className={`milestone-panel${photo ? ' milestone-with-photo' : ''}`} id={panelId} role="tabpanel" aria-labelledby={`${instanceId}-milestone-${selected}`} tabIndex={0}><div><p className="bac-timeline-position">Dấu mốc {selected + 1} / {entries.length}</p><time>{entry.date}</time><h3>{entry.title}</h3><p>{entry.text}</p><ReadingPopup sourceUrl={entry.source}>Đọc bài tư liệu →</ReadingPopup></div>{photo && <HistoricalPhoto image={photo} className="historical-portrait" sizes="(max-width: 800px) 88vw, 360px" />}</div></section>
}
