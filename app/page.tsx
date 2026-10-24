import { HOME_MEDIA } from '@/data/home-media'
import HomeActivityMedia from '@/components/HomeActivityMedia'
import ReadingPopup from '@/components/ReadingPopup'
import Image from 'next/image'
import Effects from '@/components/Effects'
import Garden from '@/components/Garden'
import DailyAction from '@/components/DailyAction'
import Link from 'next/link'
import Quiz from '@/components/Quiz'
import MessageWall from '@/components/MessageWall'
import BeforeAfter from '@/components/BeforeAfter'
import { Brand, SiteFooter } from '@/components/Chrome'
import DocumentaryMedia from '@/components/DocumentaryMedia'
import { VALUES, HISTORY, QUOTE, QUIZ } from '@/data/content'
import { loadPublishedCollections } from '@/lib/public-content'
import ContentServiceNote from '@/components/ContentServiceNote'
import Navigation from '@/components/Navigation'
import HomeDiscovery from '@/components/HomeDiscovery'
import HistoricalPhoto from '@/components/HistoricalPhoto'
import { HISTORICAL_IMAGES } from '@/data/historical-media'
import { ORGANIZATIONS } from '@/data/organizations'
import { COMMUNITY_STATS } from '@/data/community-stats'
export const dynamic = 'force-dynamic'

const STATS = [['activities', 'Hoạt động'], ['participants', 'Người tham gia'], ['deeds', 'Việc tốt được ghi nhận']]
const FLOW = [
  ['Tư tưởng', 'Nền tảng để mỗi người soi chiếu cách sống và cách làm việc.'],
  ['Giá trị', 'Những chuẩn mực cụ thể, đủ gần để áp dụng trong đời sống hằng ngày.'],
  ['Hành động', 'Giá trị chỉ trọn vẹn khi trở thành việc làm có thể nhìn thấy.'],
  ['Khu phố 19 · Cộng đồng · Lan tỏa', 'Từng việc nhỏ của từng người nối lại thành đời sống chung ấm áp.'],
]

export default async function Home() {
  const { records: [media, stats, stories, questions, challenges], unavailable } = await loadPublishedCollections(['media', 'site_stats', 'stories', 'quiz_questions', 'daily_challenges'])
  const quiz = questions.length ? questions.slice(0, 10).map(item => ({ q: item.title, o: item.options!.split('\n').map(option => option.trim()).filter(Boolean), a: item.correct!, why: item.text })) : QUIZ
  const image = (slot: string) => media.find(item => item.category === slot)
  return (
    <>

      <Effects />
      <header className="nav" id="nav"><Brand />
        <Navigation /></header>

      <main id="main">
        <section className="hero grain" aria-labelledby="h1">
          <div className="hero-art" id="art" aria-hidden="true"><svg viewBox="0 0 100 100"><use href="#kp19-lotus" /></svg></div>
          <p className="eyebrow">Triển lãm số · Phường Tân Thới Hiệp</p>
          <h1 id="h1"><span className="hero-title-line"><em>Không gian Văn hóa</em></span><span><em>Hồ Chí Minh</em></span><span className="kp"><em> - KP19</em></span></h1>
          <p className="sub">Đi từ tư tưởng đến giá trị, từ giá trị đến những việc làm bình dị của một cộng đồng khu phố.</p>
          <div className="cta"><a className="btn" href="#gia-tri">Bắt đầu tham quan <i>→</i></a></div>
          <a className="scroll" href="#gia-tri" aria-label="Cuộn xuống để khám phá">KHÁM PHÁ<i /></a>
        </section>

        <section className="flow grain" aria-labelledby="hf">
          {unavailable && <ContentServiceNote />}
          <p className="eyebrow">Lộ trình tham quan</p>
          <h2 id="hf">Ánh sáng từ tư tưởng,<br />nở hoa từ hành động.</h2>
          <div className="historical-layout"><div className="flow-timeline"><span className="prog" id="prog" /><ol id="steps">
            {FLOW.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ol></div><HistoricalPhoto image={HISTORICAL_IMAGES.portrait} className="historical-portrait" sizes="(max-width: 800px) 88vw, 360px" /></div>
        </section>

        <section className="values on-light" id="gia-tri" aria-labelledby="hv">
          <p className="eyebrow">Giá trị</p>
          <h2 id="hv">Mỗi giá trị<br />đều có thể bắt đầu từ một việc nhỏ.</h2>
          <div className="vgrid">
            <div className="vlist">
              {VALUES.map((v, i) => (
                <div className="v rv" key={v.title}><b>{String(i + 1).padStart(2, '0')}</b><h3>{v.title}</h3>
                  <p>{v.explanation}</p><p><strong>Ý nghĩa hôm nay:</strong> {v.today}</p><p><strong>Bạn có thể làm gì:</strong> {v.action}</p><small>Khu phố 19 thực hành: chờ câu chuyện địa phương đã xác minh.</small><p><ReadingPopup sourceUrl={v.source}>Đọc bài tư liệu →</ReadingPopup></p></div>
              ))}
            </div>
            <aside className="note rv"><strong>Từ tư liệu đến thực hành</strong><p>Phần giải thích được biên tập từ các nguồn dẫn kèm. Các gợi ý hành động hôm nay là đề xuất thực hành của trang.</p><blockquote>“{QUOTE.text}”</blockquote><p>{QUOTE.context}</p><ReadingPopup sourceUrl={QUOTE.source}>Đọc bài tư liệu →</ReadingPopup></aside>
          </div>
        </section>

        <section className="history on-light" aria-labelledby="hh"><p className="eyebrow">Về Bác</p><h2 id="hh">Những mốc lịch sử</h2><div className="historical-layout"><ol>{HISTORY.map(item => <li key={item.date}><time>{item.date}</time><h3>{item.title}</h3><p>{item.text}</p><ReadingPopup sourceUrl={item.source}>Đọc bài tư liệu →</ReadingPopup></li>)}</ol><HistoricalPhoto image={HISTORICAL_IMAGES.independence} className="historical-portrait" sizes="(max-width: 800px) 88vw, 360px" /></div></section>

        <section className="trans grain" aria-label="Chuyển tiếp">
          <svg className="lotus rv" viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg>
          <p className="rv">Tư tưởng và những giá trị của Người vẫn tiếp tục được lan tỏa…</p>
          <p className="rv">…trong những việc làm bình dị mỗi ngày.</p>
          <p className="rv last">Và tại Khu phố 19…</p>
        </section>

        <section className="kp19 on-light" id="khu-pho-19" aria-labelledby="hk">
          <div className="split">
            <div><p className="eyebrow">Khu phố 19 · Phường Tân Thới Hiệp</p>
              <h2 id="hk">Khu phố 19.<br /><em>Những điều bình dị làm nên giá trị lớn.</em></h2>
              <p className="lede">Nơi các tổ chức đoàn thể cùng làm việc: Ban Công tác Mặt trận, Hội Cựu chiến binh, Hội Người cao tuổi, Hội Liên hiệp Phụ nữ và Đoàn Thanh niên.</p></div>
            {image('hero') ? <DocumentaryMedia item={image('hero')} priority /> : <figure className="kp19-community-photo"><Image src="/images/kp19/kp19.jpg" alt="Ảnh tổng hợp các hoạt động và sinh hoạt cộng đồng Khu phố 19" width={1200} height={1400} sizes="(max-width: 800px) 88vw, 42vw" /><figcaption>Hoạt động và sinh hoạt cộng đồng Khu phố 19</figcaption></figure>}
          </div>
          <div className="stats" role="list" aria-label="Số liệu Khu phố 19">
            {STATS.map(([key, label]) => { const stat = stats.find(item => item.category === key); return <div className="stat rv" role="listitem" key={key}><b>{stat ? stat.value.toLocaleString('vi-VN') : `${COMMUNITY_STATS[key]}+`}</b><span>{label}</span>{stat && <small>{`Kỳ: ${stat.period} · Nguồn: ${stat.source} · Xác minh: ${stat.verifiedBy}, ${stat.verifiedOn}`}</small>}</div> })}
          </div>
          <div className="orgs"><p className="eyebrow">Các tổ chức</p><h3 style={{ marginTop: 14 }}>Năm tổ chức, một khu phố.</h3>
            <div className="og">
              {ORGANIZATIONS.map(({ id: k, name: n, logo }) => (
                <div className="o rv" key={k}>
                  <Image src={logo} width={170} height={170} alt={`Biểu trưng ${n} Khu phố 19`} />
                  <span>{n}</span></div>
              ))}
            </div></div>
          {image('before') && image('after') && <><BeforeAfter before={image('before')!.url} after={image('after')!.url} label="Khu phố 19 trước và sau cải tạo" /><div className="media-credits">{['before', 'after'].map(slot => { const item = image(slot)!; return <p key={slot}>{slot === 'before' ? 'Trước' : 'Sau'}: {item.title} · {item.date} · Ảnh: {item.photographer} · Quyền đăng: {item.permission} · Nguồn: {item.source}</p> })}</div></>}
          <div className="more"><Link className="btn dark" href="/cau-chuyen">Đọc câu chuyện đẹp <i>→</i></Link><Link className="btn dark" href="/thu-vien">Mở thư viện số <i>→</i></Link></div>
          <div className="bento" aria-label="Các mảng hoạt động">
            {HOME_MEDIA.map(item => <div key={item.slot} className={`bt b${item.slot.slice(-1)}`}><h3>{item.label}</h3><HomeActivityMedia item={image(item.slot)} fallback={item} /></div>)}
          </div>
        </section>

        <Garden />
        <HomeDiscovery stories={stories} />
        <DailyAction challenges={challenges} />
        <Quiz questions={quiz} />
        <MessageWall />

        <section className="close grain" aria-labelledby="hc">
          <p className="eyebrow">Lan tỏa</p>
          <h2 id="hc">Giá trị đẹp bắt đầu từ việc nhỏ của bạn.</h2>
          <a className="btn" href="#vuon-hoa">Trồng một bông hoa <i>→</i></a>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
