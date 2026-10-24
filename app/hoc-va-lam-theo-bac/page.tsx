import './learn.css'
import Image from 'next/image'
import Link from 'next/link'
import { SiteFooter, SubHeader } from '@/components/Chrome'
import { NextChapter } from '@/components/ExhibitionPage'
import ReadingPopup from '@/components/ReadingPopup'
import ValueLotus from '@/components/ValueLotus'
import PracticePlanner from '@/components/PracticePlanner'
import PracticeSituations from '@/components/PracticeSituations'
import HistoricalPhoto from '@/components/HistoricalPhoto'
import { HISTORICAL_IMAGES } from '@/data/historical-media'
import { LIBRARY, SOURCES } from '@/data/content'
import { PRACTICE_RESOURCE_IDS } from '@/data/practice'
import { chapterMetadata } from '@/lib/metadata'

export const metadata = chapterMetadata('Học & làm theo Bác', 'Tìm hiểu giá trị qua tư liệu có nguồn, chọn một trong 12 việc thực hành, lập kế hoạch và suy ngẫm qua các tình huống gần gũi.', '/hoc-va-lam-theo-bac')
const resources = PRACTICE_RESOURCE_IDS.flatMap(id => { const item = LIBRARY.find(entry => entry.id === id); return item ? [item] : [] })
const sections = [['lo-trinh', 'Cách bắt đầu'], ['lotus-title', 'Bông sen giá trị'], ['hanh-dong', 'Việc hôm nay'], ['tinh-huong', 'Tình huống'], ['tu-lieu-thuc-hanh', 'Tư liệu']]

export default function Page() {
  return <><SubHeader /><main id="main" className="learn-bac">
    <section className="learn-hero grain" aria-labelledby="learn-title"><div className="learn-hero-copy"><p className="eyebrow">Chương 02 · Học & làm theo Bác</p><h1 id="learn-title">Hiểu điều tốt đẹp.<br /><em>Bắt đầu việc nhỏ.</em></h1><p className="learn-hero-lede">Một giá trị trở nên gần gũi khi ta hiểu ý nghĩa và tìm được cách thực hành. Chọn một việc vừa sức, làm bằng sự quan tâm và nhìn lại điều mình đã học.</p><div className="learn-hero-actions"><a className="btn" href="#hanh-dong">Chọn việc hôm nay <span aria-hidden="true">↓</span></a><a href="#lotus-title">Khám phá bông sen giá trị →</a></div><p className="learn-hero-caption">Đọc có nguồn · Làm vừa sức · Tiếp tục mỗi ngày</p></div><div className="learn-hero-photo"><HistoricalPhoto image={HISTORICAL_IMAGES.children} sizes="(max-width: 800px) 88vw, 48vw" /><ReadingPopup sourceUrl={SOURCES.children}>Đọc tư liệu Bác Hồ với thiếu nhi →</ReadingPopup></div></section>
    <nav className="learn-section-nav" aria-label="Khám phá trang Học và làm theo Bác"><span>Trong chương này</span><ul>{sections.map(([id, label], index) => <li key={id}><a href={`#${id}`}><small>0{index + 1}</small>{label}</a></li>)}</ul></nav>

    <section className="learn-roadmap on-light" id="lo-trinh" aria-labelledby="learn-roadmap-title"><div className="learn-section-heading"><div><p className="eyebrow">Từ hiểu đến làm</p><h2 id="learn-roadmap-title">Một cách bắt đầu.<br />Ba bước gần gũi.</h2></div><p>Đây là gợi ý học tập của trang. Bạn có thể điều chỉnh theo thời gian, khả năng và nhu cầu thực tế của mình.</p></div><ol className="learn-roadmap-steps"><li><span>01</span><h3>Đọc để hiểu.</h3><p>Chọn một tư liệu, xem nguồn xuất bản và hoàn cảnh. Ghi lại điều đã hiểu bằng lời của mình, rồi mở nguồn để đối chiếu.</p><ReadingPopup sourceUrl={SOURCES.learning}>Đọc về tinh thần học tập →</ReadingPopup></li><li><span>02</span><h3>Chọn để làm.</h3><p>Chọn một việc cụ thể, vừa sức. Xác định các bước cần làm và trao đổi với người liên quan khi cần phối hợp.</p><a href="#hanh-dong">Chọn một việc thực hành →</a></li><li><span>03</span><h3>Nhìn lại để tiến bộ.</h3><p>Tự hỏi điều gì đã làm được, điều gì cần sửa và ai đã được hỗ trợ. Một ghi chú ngắn giúp bạn tiếp tục rõ ràng hơn.</p><a href="#hanh-dong">Ghi điều mình nhận ra →</a></li></ol></section>

    <ValueLotus />
    <PracticePlanner />
    <PracticeSituations />

    <section className="learn-resources on-light" id="tu-lieu-thuc-hanh" aria-labelledby="learn-resources-title"><div className="learn-section-heading"><div><p className="eyebrow">Tư liệu đồng hành</p><h2 id="learn-resources-title">Đọc thêm một điều.<br />Hiểu sâu một việc.</h2></div><p>Những bản đọc, video và infographic được chọn để hỗ trợ việc học và thực hành. Mỗi mục đều ghi rõ nguồn và cách biên soạn.</p></div><ul className="learn-resource-grid">{resources.map(item => <li key={item.id}><div className="learn-resource-art">{item.media?.kind === 'infographic' ? <Image src={item.media.src} width={item.media.width} height={item.media.height} alt={item.media.alt} unoptimized /> : item.media?.kind === 'book-guide' ? <Image src={item.media.src} width={600} height={840} alt={`Bìa hồ sơ ${item.title}, do trang thiết kế`} unoptimized /> : <><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg><span>Video tư liệu</span><span aria-hidden="true">▶</span></>}</div><div className="learn-resource-copy"><p className="library-type">{item.type} · {item.type === 'Video' ? 'Báo Nhân Dân' : item.type === 'Sách' ? 'Bản đọc giới thiệu' : 'Trang biên soạn'}</p><h3>{item.title}</h3><p>{item.description}</p><small>{item.source}</small><ReadingPopup sourceUrl={item.url} itemId={item.id}>{item.type === 'Video' ? 'Xem video' : item.type === 'Sách' ? 'Đọc giới thiệu tác phẩm' : 'Xem infographic'} →</ReadingPopup></div></li>)}</ul><Link className="learn-library-link" href="/thu-vien">Khám phá toàn bộ thư viện số <span aria-hidden="true">↗</span></Link></section>

    <section className="learn-reading-guide on-light" aria-labelledby="learn-guide-title"><div><p className="eyebrow">Học có nguồn · Làm có suy ngẫm</p><h2 id="learn-guide-title">Giữ sự rõ ràng<br />khi học và chia sẻ.</h2><p>Các cách thực hành trên trang là gợi ý biên soạn cho đời sống hôm nay. Khi tìm hiểu tư tưởng, đạo đức và phong cách Hồ Chí Minh, hãy đọc nguồn và đặt tư liệu trong hoàn cảnh lịch sử.</p><Link className="learn-text-link" href="/ve-bac">Tìm hiểu cuộc đời và những giá trị của Bác →</Link></div><div className="learn-questions"><details open><summary>Bắt đầu như thế nào khi ít thời gian?</summary><p>Chọn một việc nhỏ mà bạn có thể hoàn thành trong điều kiện hiện tại. Nếu chưa làm hết, ghi lại bước tiếp theo và điều chỉnh kế hoạch cho phù hợp.</p></details><details><summary>Làm sao phân biệt tư liệu với gợi ý của trang?</summary><p>Bài đọc và infographic biên soạn có nhãn riêng cùng liên kết nguồn. Tác phẩm ghi rõ bản quét hoặc bản giới thiệu. Kế hoạch và tình huống là gợi ý để bạn tự suy ngẫm.</p></details><details><summary>Có cần công khai ghi chú thực hành không?</summary><p>Ghi chú trong kế hoạch dành cho bạn và không được gửi lên website. Bạn có thể tải hoặc sao chép để lưu lại; việc chia sẻ một câu chuyện là lựa chọn riêng.</p></details></div></section>

    <section className="learn-share grain" aria-labelledby="learn-share-title"><div><p className="eyebrow">Từ việc nhỏ đến sự sẻ chia</p><h2 id="learn-share-title">Một điều đã làm.<br />Một điều muốn tiếp nối.</h2><p>Nếu có một việc tốt muốn kể, bạn có thể gửi câu chuyện của mình tới Vườn hoa việc tốt. Hoặc tiếp tục khám phá cách Khu phố 19 đưa những giá trị vào đời sống cộng đồng.</p></div><div><Link className="btn" href="/vuon-hoa-viec-tot">Gửi một việc tốt ↗</Link><Link href="/tuong-tac">Khám phá trang Tương tác →</Link></div></section>
    <NextChapter label="Chương tiếp theo" href="/khu-pho-19" title="Khu phố 19 làm theo Bác" />
  </main><SiteFooter /></>
}
