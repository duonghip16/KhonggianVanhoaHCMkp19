import './ve-bac.css'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter, SubHeader } from '@/components/Chrome'
import { NextChapter } from '@/components/ExhibitionPage'
import ReadingPopup from '@/components/ReadingPopup'
import HistoryTimeline from '@/components/HistoryTimeline'
import HistoricalPhoto from '@/components/HistoricalPhoto'
import { HISTORICAL_IMAGES } from '@/data/historical-media'
import { BIOGRAPHY_READING } from '@/data/biography'
import { BIOGRAPHY_MILESTONES, VE_BAC_PILLARS, VE_BAC_RESOURCE_IDS } from '@/data/ve-bac'
import { QUOTE, LIBRARY, SOURCES } from '@/data/content'
import { chapterMetadata } from '@/lib/metadata'

export const metadata = chapterMetadata('Về Bác', 'Khám phá cuộc đời, tư tưởng, đạo đức và phong cách Hồ Chí Minh: tiểu sử theo giai đoạn, ảnh tư liệu, tác phẩm và nguồn đối chiếu.', '/ve-bac')
const sections = [
  ['cuoc-doi', 'Cuộc đời'], ['history-title', 'Dấu mốc'], ['tu-tuong', 'Những giá trị'],
  ['bac-va-thieu-nhi', 'Bác với thiếu nhi'], ['tu-lieu-chon-loc', 'Tư liệu chọn lọc'],
]
const resources = VE_BAC_RESOURCE_IDS.map(id => LIBRARY.find(item => item.id === id)!).filter(Boolean)

export default function Page() {
  return <><SubHeader /><main id="main" className="about-bac">
    <section className="bac-hero grain" aria-labelledby="bac-title">
      <div className="bac-hero-copy"><p className="eyebrow">Chương 01 · Về Bác</p><p className="bac-hero-period">Hồ Chí Minh · 1890–1969</p><h1 id="bac-title">Một cuộc đời.<br /><em>Những giá trị<br />còn mãi.</em></h1><p className="bac-hero-lede">Tìm hiểu cuộc đời và hành trình của Chủ tịch Hồ Chí Minh qua tư liệu lịch sử. Đọc để hiểu, suy ngẫm và tiếp nối những điều tốt đẹp trong đời sống hôm nay.</p><div className="bac-hero-actions"><a className="btn" href="#cuoc-doi">Khám phá cuộc đời <span aria-hidden="true">↓</span></a><ReadingPopup sourceUrl={SOURCES.biography}>Đọc trọn bài tiểu sử →</ReadingPopup></div></div>
      <div className="bac-hero-portrait"><HistoricalPhoto image={HISTORICAL_IMAGES.portrait} sizes="(max-width: 800px) 85vw, 380px" /></div>
    </section>
    <nav className="bac-section-nav" aria-label="Khám phá trang Về Bác"><span>Trong chương này</span><ul>{sections.map(([id, label], index) => <li key={id}><a href={`#${id}`}><small>0{index + 1}</small>{label}</a></li>)}</ul></nav>

    <section id="cuoc-doi" className="bac-biography on-light" aria-labelledby="bac-biography-title">
      <div className="bac-section-intro"><p className="eyebrow">Cuộc đời & sự nghiệp</p><h2 id="bac-biography-title">Từ quê hương<br />đến hành trình lịch sử.</h2><p>Mỗi giai đoạn mở thêm một góc nhìn về cuộc đời của Người. Chọn phần muốn đọc; nguồn đối chiếu nằm ngay dưới nội dung.</p><dl className="bac-facts"><div><dt>Tên lúc nhỏ</dt><dd>Nguyễn Sinh Cung</dd></div><div><dt>Ngày sinh</dt><dd>19 tháng 5 năm 1890</dd></div><div><dt>Quê hương</dt><dd>Nghệ An</dd></div></dl><div className="biography-copy"><ReadingPopup sourceUrl={SOURCES.biography}>Mở phòng đọc tiểu sử →</ReadingPopup></div><p className="bac-editorial-note">Bản đọc do Khu phố 19 biên soạn theo các tư liệu được dẫn nguồn.</p></div>
      <div className="bac-chapters">{BIOGRAPHY_READING.sections.map((chapter, index) => <details key={chapter.title} className="bac-chapter" open={index === 0}><summary><span className="bac-chapter-number">{String(index + 1).padStart(2, '0')}</span><h3>{chapter.title}</h3><span className="bac-chapter-toggle" aria-hidden="true" /></summary><div className="bac-chapter-body">{chapter.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{chapter.image && <HistoricalPhoto image={chapter.image} sizes="(max-width: 800px) 85vw, 700px" />}{chapter.source && <div className="bac-chapter-sources"><span>Nguồn đối chiếu</span>{[chapter.source, ...(chapter.references ?? [])].map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>}</div></details>)}</div>
    </section>

    <HistoryTimeline entries={BIOGRAPHY_MILESTONES} />

    <section id="tu-tuong" className="bac-values on-light" aria-labelledby="bac-values-title"><div className="bac-section-heading"><div><p className="eyebrow">Tư tưởng · Đạo đức · Phong cách</p><h2 id="bac-values-title">Hiểu những giá trị.<br />Soi vào việc làm.</h2></div><p>Đi từ tư liệu đến suy ngẫm. Mỗi chủ đề dẫn tới một bài đọc có nguồn, giúp bạn tìm hiểu trong bối cảnh đầy đủ hơn.</p></div><div className="bac-pillars">{VE_BAC_PILLARS.map(pillar => <article key={pillar.number}><div className="bac-pillar-label"><span>{pillar.number}</span><p>{pillar.label}</p></div><h3>{pillar.title}</h3><p>{pillar.text}</p><ReadingPopup sourceUrl={pillar.source}>{pillar.action} →</ReadingPopup></article>)}</div><div className="bac-values-followup"><p>Điều đã hiểu có thể bắt đầu bằng một việc nhỏ: giữ lời hẹn, lắng nghe người khác, tiết kiệm nguồn lực hoặc chia sẻ điều hữu ích.</p><Link href="/hoc-va-lam-theo-bac">Khám phá những cách thực hành →</Link></div></section>

    <section id="bac-va-thieu-nhi" className="bac-humanity on-light" aria-labelledby="bac-humanity-title"><HistoricalPhoto image={HISTORICAL_IMAGES.children} sizes="(max-width: 800px) 88vw, 50vw" /><div><p className="eyebrow">Một góc nhìn qua ảnh</p><h2 id="bac-humanity-title">Sự quan tâm<br />dành cho thế hệ trẻ.</h2><p>Những cuộc gặp với thiếu nhi ở Việt Bắc và Phủ Chủ tịch được lưu giữ qua ảnh tư liệu. Bên cạnh các dấu mốc lịch sử, những hình ảnh ấy giúp chúng ta tìm hiểu sự quan tâm của Người tới đời sống, việc học và tương lai của trẻ em.</p><p>Đọc chú thích và thời điểm của từng ảnh để hiểu đúng hoàn cảnh, đồng thời trân trọng người đã ghi lại và lưu giữ tư liệu.</p><ReadingPopup sourceUrl={SOURCES.children}>Đọc tư liệu Bác Hồ với thiếu nhi →</ReadingPopup></div></section>

    <section className="quote-exhibit bac-quote grain" aria-labelledby="bac-quote-title"><p id="bac-quote-title" className="eyebrow">Lời Người qua tư liệu</p><blockquote>“{QUOTE.text}”</blockquote><p>{QUOTE.context}</p><ReadingPopup sourceUrl={QUOTE.source}>Đọc bối cảnh và nguồn trích dẫn →</ReadingPopup></section>

    <section id="tu-lieu-chon-loc" className="bac-resources on-light" aria-labelledby="bac-resources-title"><div className="bac-section-heading"><div><p className="eyebrow">Đọc · Xem · Nghe</p><h2 id="bac-resources-title">Tiếp tục từ một tư liệu.</h2></div><p>Tác phẩm, chương trình và hình ảnh mở ra những hướng tìm hiểu khác nhau. Chọn một mục để đọc hoặc phát ngay tại đây.</p></div><ul className="bac-resource-grid">{resources.map((item, index) => <li key={item.id}><div className="bac-resource-art">{item.media?.kind === 'book' || item.media?.kind === 'book-guide' ? <Image src={item.media.kind === 'book' ? '/books/duong-kach-menh-cover.jpg' : item.media.src} alt={item.media.kind === 'book' ? 'Trang đầu bản quét Đường Kách mệnh' : `Bìa hồ sơ ${item.title} do trang thiết kế`} width={600} height={840} unoptimized sizes="(max-width: 700px) 85vw, 28vw" /> : <><span className="bac-resource-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{item.type === 'Video' ? 'Xem một góc nhìn' : item.type === 'Audio' ? 'Lắng nghe tư liệu' : 'Khái quát bằng hình ảnh'}</span><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg></>}</div><div className="bac-resource-copy"><p className="library-type">{item.type} · {item.media?.kind === 'book-guide' ? 'Bản đọc giới thiệu' : item.media?.kind === 'book' ? 'Bản quét nguyên bản' : item.type === 'Infographic' ? 'Trang biên soạn' : 'Từ nguồn xuất bản'}</p><h3>{item.title}</h3><p>{item.description}</p><small>{item.source}</small><ReadingPopup sourceUrl={item.url} itemId={item.id}>{item.type === 'Video' ? 'Xem video' : item.type === 'Audio' ? 'Nghe chương trình' : item.type === 'Infographic' ? 'Xem infographic' : 'Mở tác phẩm'} →</ReadingPopup></div></li>)}</ul><Link className="bac-library-link" href="/thu-vien">Khám phá toàn bộ thư viện số <span aria-hidden="true">↗</span></Link></section>

    <section className="bac-source-note on-light" aria-labelledby="bac-source-title"><div><p className="eyebrow">Đọc có nguồn</p><h2 id="bac-source-title">Hiểu tư liệu<br />trong bối cảnh.</h2></div><div><p>Các bài đọc trên trang được biên soạn theo nguồn của bảo tàng, cơ quan nhà nước và cơ quan báo chí. Mỗi phần tiểu sử có liên kết đối chiếu; ảnh giữ chú thích và hồ sơ quyền sử dụng riêng.</p><p>Sách ghi rõ bản quét hay hồ sơ giới thiệu. Video và audio sử dụng trình phát của nguồn xuất bản. Những gợi ý thực hành được trình bày là nội dung do trang biên soạn.</p><ReadingPopup sourceUrl={SOURCES.biography}>Bắt đầu đối chiếu từ bài tiểu sử →</ReadingPopup></div></section>
    <NextChapter label="Chương tiếp theo" href="/hoc-va-lam-theo-bac" title="Từ giá trị đến hành động" />
  </main><SiteFooter /></>
}
