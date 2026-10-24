import Image from 'next/image'
import ExhibitionPage, { NextChapter } from '@/components/ExhibitionPage'
import DocumentaryMedia from '@/components/DocumentaryMedia'
import VerifiedStats from '@/components/VerifiedStats'
import BeforeAfter from '@/components/BeforeAfter'
import { loadPublishedCollections } from '@/lib/public-content'
import ContentServiceNote from '@/components/ContentServiceNote'
import { chapterMetadata } from '@/lib/metadata'
import { ORGANIZATIONS } from '@/data/organizations'
export const dynamic = 'force-dynamic'
export const metadata = chapterMetadata('Khu phố 19 làm theo Bác', 'Không gian cộng đồng Khu phố 19, phường Tân Thới Hiệp: hoạt động, câu chuyện và số liệu có nguồn xác minh.', '/khu-pho-19')
const COMMUNITY_ACTIVITIES = [
  { title: 'An sinh & nghĩa tình', image: 'an sinh nghĩa tình.jpg', width: 1280, height: 960, alt: 'Bà con cùng tham gia buổi sinh hoạt cộng đồng tại Khu phố 19' },
  { title: 'Văn hóa & học tập', image: 'văn hóa học tập.jpg', width: 2560, height: 1920, alt: 'Các em học sinh nhận sách trong hoạt động trao tặng sách tại Khu phố 19' },
  { title: 'Môi trường sống', image: 'môi trường sống.jpg', width: 2568, height: 1926, alt: 'Bà con và các thành viên đoàn thể gặp gỡ trong không gian khu phố' },
  { title: 'Người tốt, việc tốt', image: 'người tốt việc tốt.jpg', width: 2560, height: 1920, alt: 'Đoàn viên và bà con cùng chuẩn bị những phần ăn sẻ chia' },
]
export default async function Page() {
  const { records: [media, stats], unavailable } = await loadPublishedCollections(['media', 'site_stats'])
  const before = media.find(item => item.category === 'before'), after = media.find(item => item.category === 'after')
  return <ExhibitionPage eyebrow="Chương 03 · Khu phố 19" title="Những điều bình dị làm nên giá trị lớn." description="Đưa những giá trị tốt đẹp vào đời sống chung. Tìm hiểu các hoạt động, con người và việc làm của cộng đồng qua những tư liệu được xác minh." tone="emerald">
    <section className="community-intro on-light"><div className="split"><div><p className="eyebrow">Phường Tân Thới Hiệp · TP. Hồ Chí Minh</p><h2>Cộng đồng là nơi<br />giá trị nở hoa.</h2><p className="lede">Không gian này dành cho những việc làm cụ thể của Khu phố 19. Mỗi câu chuyện, hình ảnh và số liệu đều cần được đối chiếu trước khi công bố.</p></div><figure className="kp19-community-photo"><Image src="/images/kp19/tổng.png" alt="Tổng hợp hoạt động an sinh, giao lưu, về nguồn và sinh hoạt cộng đồng Khu phố 19" width={1536} height={1024} sizes="(max-width: 800px) 88vw, 42vw" style={{ aspectRatio: '3 / 2' }} /></figure></div><VerifiedStats records={stats} /></section>
    {unavailable && <ContentServiceNote />}
    <section className="community-organizations on-light"><p className="eyebrow">Cùng chung sức</p><h2>Các tổ chức trong khu phố.</h2><div className="og">{ORGANIZATIONS.map(({ id, name, logo }) => <div className="o" key={id}><Image src={logo} width={170} height={170} alt={`Biểu trưng ${name}`} /><span>{name}</span></div>)}</div></section>
    <section className="on-light"><p className="eyebrow">Những mảng hoạt động</p><h2>Gần gũi với đời sống.</h2><div className="bento community-activities">{COMMUNITY_ACTIVITIES.map((item, index) => <article key={item.title} className={`bt b${index + 1}`}><h3>{item.title}</h3><figure className="kp19-community-photo"><Image src={`/images/kp19/${item.image}`} width={item.width} height={item.height} alt={item.alt} sizes="(max-width: 700px) 90vw, 44vw" /></figure></article>)}</div></section>
    {before && after && <section className="on-light"><p className="eyebrow">Thay đổi từ hành động</p><h2>Nhìn lại để thấy đổi thay.</h2><BeforeAfter before={before.url} after={after.url} label={after.title} /><div className="media-credits">{[before, after].map(item => <p key={item.id}>{item.title}<br />{item.photographer}</p>)}</div></section>}
    <NextChapter label="Chương tiếp theo" href="/cau-chuyen" title="Những câu chuyện đẹp" />
  </ExhibitionPage>
}
