import type { Metadata } from 'next'
import Link from 'next/link'
import { NextChapter } from '@/components/ExhibitionPage'
import { SiteFooter, SubHeader } from '@/components/Chrome'
import HistoricalPhoto from '@/components/HistoricalPhoto'
import { HISTORICAL_IMAGES } from '@/data/historical-media'
import LibraryGrid from '@/components/LibraryGrid'
import { LIBRARY, type LibItem } from '@/data/content'
import { managedLibraryItem } from '@/lib/managed-library'
import { publishedRecords } from '@/lib/public-content'
import { chapterMetadata } from '@/lib/metadata'
import { prepareLibrary } from '@/lib/library'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = chapterMetadata('Thư viện số', 'Đọc, xem, nghe và khám phá tư liệu có nguồn về Hồ Chí Minh và cộng đồng Khu phố 19.', '/thu-vien')
export default async function Page({ searchParams }: { searchParams: Promise<{ doc?: string | string[] }> }) {
  const { doc } = await searchParams
  let managed: LibItem[] = []
  let contentUnavailable = false
  try {
    managed = (await publishedRecords('library')).map(managedLibraryItem).filter((item): item is LibItem => item !== null)
  } catch { contentUnavailable = true }
  const library = prepareLibrary([...managed, ...LIBRARY])
  return <><SubHeader /><main id="main">
    <section className="library-hero grain" aria-labelledby="library-hero-title"><div className="library-hero-copy"><p className="eyebrow">Chương 06 · Thư viện số</p><h1 id="library-hero-title">Mở một trang tư liệu.<br /><em>Tìm thêm một góc nhìn.</em></h1><p className="page-lede">Khám phá cuộc đời, tư tưởng và những giá trị của Chủ tịch Hồ Chí Minh qua sách, ảnh, video, audio, infographic và các bài đọc có nguồn.</p><div className="library-hero-actions"><a className="btn" href="#bo-suu-tap">Khám phá thư viện <span aria-hidden="true">↓</span></a><Link href="/thu-vien?doc=tieu-su">Bắt đầu từ tiểu sử Bác ↗</Link></div><p className="library-hero-count">{library.length} tư liệu trong bộ sưu tập</p></div><HistoricalPhoto image={HISTORICAL_IMAGES.children} className="library-hero-photo" /></section>
    <section className="library-collection on-light" id="bo-suu-tap" aria-labelledby="library-title">{contentUnavailable && <p className="library-service-note" role="status">Tư liệu do khu phố cập nhật đang tạm thời chưa tải được. Bạn vẫn có thể khám phá bộ sưu tập tư liệu bên dưới.</p>}<LibraryGrid library={library} initialItemId={typeof doc === 'string' ? doc : undefined} /><aside className="library-reading-note"><span aria-hidden="true">↗</span><div><h3>Đọc cùng một câu hỏi.</h3><p>Điều gì trong tư liệu này có thể trở thành một việc làm nhỏ hôm nay? Ghi lại điều bạn học được, đối chiếu nguồn và chia sẻ với người cần.</p></div><Link href="/hoc-va-lam-theo-bac">Từ tư liệu đến thực hành →</Link></aside></section>
    <section className="library-provenance on-light" aria-labelledby="library-provenance-title"><div><p className="eyebrow">Nguồn & cách biên soạn</p><h2 id="library-provenance-title">Hiểu tư liệu.<br />Trân trọng nguồn gốc.</h2></div><ol><li><span>01</span><div><h3>Giữ nguyên tư liệu gốc</h3><p>Sách ghi rõ bản quét nguyên bản hoặc hồ sơ giới thiệu do trang biên soạn. Video dùng trình phát của cơ quan xuất bản; audio phát từ VOV6. Ảnh giữ chú thích và hồ sơ quyền sử dụng.</p></div></li><li><span>02</span><div><h3>Ghi rõ phần trang biên soạn</h3><p>Các bài đọc và infographic do trang biên soạn đều có nhãn riêng, kèm nguồn để đối chiếu.</p></div></li><li><span>03</span><div><h3>Đọc trong bối cảnh</h3><p>Ảnh liên quan có chú thích riêng. Thời điểm sự kiện, năm xuất bản và ngày phát chương trình được ghi đúng theo từng tư liệu.</p></div></li></ol></section>
    <NextChapter label="Từ điều đã đọc" href="/tuong-tac" title="Thử một việc làm hôm nay" />
  </main><SiteFooter /></>
}
