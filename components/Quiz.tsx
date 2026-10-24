'use client'
import { SITE_NAME } from '@/data/site'
import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { QUIZ, type QA } from '@/data/content'

const P = ['M50 14C62 34 62 62 50 82C38 62 38 34 50 14Z', 'M50 82C34 76 20 58 22 36C34 40 46 56 50 82Z', 'M50 82C66 76 80 58 78 36C66 40 54 56 50 82Z', 'M50 84C30 86 12 72 8 54C24 54 42 64 50 84Z', 'M50 84C70 86 88 72 92 54C76 54 58 64 50 84Z']

export default function Quiz({ questions = QUIZ }: { questions?: QA[] }) {
  const [i, setI] = useState(0); const [pick, setPick] = useState<number | null>(null)
  const [score, setScore] = useState(0); const [done, setDone] = useState(false)
  const svg = useRef<SVGSVGElement>(null)
  const [exportMessage, setExportMessage] = useState('')
  const [exporting, setExporting] = useState(false)
  const available = questions.length ? questions : QUIZ
  const q = available[i]; const n = available.length
  const badgeId = useId().replace(/:/g, '')
  const encouragement = score === n ? ['Bạn đã làm rất tốt!', 'Tiếp nối bằng một việc tốt hôm nay.'] : score >= n / 2 ? ['Mỗi lần học, thêm một bước tiến.', 'Giữ điều đã hiểu. Thử điều tốt đẹp.'] : ['Bắt đầu là một bước đáng quý.', 'Cứ học thêm, bạn sẽ tiến bộ mỗi ngày.']
  const choose = (k: number) => { if (pick !== null) return; setPick(k); if (k === q.a) setScore(s => s + 1) }
  const next = () => { if (i + 1 >= n) setDone(true); else { setI(i + 1); setPick(null) } }
  const reset = () => { setI(0); setPick(null); setScore(0); setDone(false) }
  const badgePng = async () => {
    if (!svg.current) throw new Error('Badge unavailable')
    const copy = svg.current.cloneNode(true) as SVGSVGElement
    copy.setAttribute('width', '400'); copy.setAttribute('height', '500')
    const source = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' }))
    try {
      await document.fonts.ready
      const picture = new window.Image()
      await new Promise<void>((resolve, reject) => { picture.onload = () => resolve(); picture.onerror = reject; picture.src = source })
      const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 1000
      const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable')
      context.drawImage(picture, 0, 0, 800, 1000)
      return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Export unavailable')), 'image/png'))
    } finally { URL.revokeObjectURL(source) }
  }
  const download = async () => {
    setExporting(true); setExportMessage('')
    try {
      const png = await badgePng()
      const url = URL.createObjectURL(png), link = document.createElement('a')
      link.href = url; link.download = 'huy-hieu-khu-pho-19.png'; link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { setExportMessage('Chưa xuất được ảnh. Vui lòng thử lại trên trình duyệt hỗ trợ canvas.') }
    finally { setExporting(false) }
  }
  const share = async () => {
    setExporting(true); setExportMessage('')
    try {
      const file = new File([await badgePng()], 'huy-hieu-khu-pho-19.png', { type: 'image/png' })
      const text = `Mình đã hoàn thành thử thách tại ${SITE_NAME}: ${score}/${n} câu. ${encouragement.join(' ')} Cùng mình lan tỏa một việc tốt nhé!`
      const url = new URL('/tuong-tac', window.location.origin).toString()
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'Người lan tỏa giá trị đẹp', text })
      else if (navigator.share) await navigator.share({ title: 'Người lan tỏa giá trị đẹp', text, url })
      else { await navigator.clipboard.writeText(`${text}\n${url}`); setExportMessage('Đã sao chép kết quả và đường dẫn.') }
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setExportMessage('Bạn có thể tải huy hiệu và gửi ảnh cho người thân.') }
    finally { setExporting(false) }
  }
  return (
    <section className="quiz on-light" id="trac-nghiem" aria-labelledby="hq">
      <p className="eyebrow">Thử thách</p>
      <h2 id="hq">Bạn sẽ làm gì?</h2>
      {!done ? (
        <div className="qbox">
          <p className="qn" aria-live="polite">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
          <div className="qbar" role="progressbar" aria-label="Tiến độ thử thách" aria-valuemin={0} aria-valuemax={n} aria-valuenow={i + (pick !== null ? 1 : 0)}><i style={{ width: ((i + (pick !== null ? 1 : 0)) / n) * 100 + '%' }} /></div>
          <h3 className="qq">{q.q}</h3>
          <div className="opts">
            {q.o.map((o, k) => {
              const st = pick === null ? '' : k === q.a ? ' ok' : k === pick ? ' no' : ''
              return <button key={k} type="button" className={'opt' + st} onClick={() => choose(k)} aria-disabled={pick !== null}>
                <span>{o}</span>{st === ' ok' && <b aria-label="Đúng">✓</b>}{st === ' no' && <b aria-label="Chưa phù hợp">✕</b>}</button>
            })}
          </div>
          <div aria-live="polite">{pick !== null && <div className="why"><p>{q.why}</p><button className="btn dark" onClick={next}>{i + 1 >= n ? 'Xem kết quả' : 'Câu tiếp theo'} <i>→</i></button></div>}</div>
        </div>
      ) : (
        <div className="qres">
          <div className="quiz-celebration"><p className="eyebrow">Một bước tiến của bạn</p><h3>Bạn đã dành thời gian<br />cho điều tốt đẹp.</h3><p>{encouragement.join(' ')}</p></div>
          <svg ref={svg} viewBox="0 0 400 500" role="img" aria-label={`Huy hiệu Người lan tỏa giá trị đẹp, ${score}/${n} câu. ${encouragement.join(' ')}`} xmlns="http://www.w3.org/2000/svg" fontFamily="Arial, sans-serif">
            <defs><linearGradient id={`${badgeId}-green`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#073f3a" /><stop offset="1" stopColor="#16816c" /></linearGradient><linearGradient id={`${badgeId}-gold`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff0ba" /><stop offset=".5" stopColor="#dbb363" /><stop offset="1" stopColor="#b88a35" /></linearGradient></defs>
            <rect width="400" height="500" rx="24" fill="#fffaf0" />
            <path d="M24 0H376Q400 0 400 24V205Q200 260 0 205V24Q0 0 24 0" fill={`url(#${badgeId}-green)`} />
            <circle cx="8" cy="15" r="106" fill="none" stroke="#ffffff" strokeOpacity=".08" strokeWidth="20" /><circle cx="390" cy="200" r="95" fill="none" stroke="#ffffff" strokeOpacity=".08" strokeWidth="20" />
            <text x="200" y="31" textAnchor="middle" fontSize="10" fill="#e6d3a6">{SITE_NAME}</text>
            <text x="200" y="54" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#c8e5d9">HỌC HÔM NAY · LÀM MỖI NGÀY</text>
            <path d="M170 179L160 226L200 208L240 226L230 179" fill="#bd984d" />
            <circle cx="200" cy="143" r="69" fill={`url(#${badgeId}-gold)`} /><circle cx="200" cy="143" r="59" fill="#fff9e8" /><circle cx="200" cy="143" r="53" fill="none" stroke="#cba75e" strokeDasharray="2 5" />
            <g transform="translate(159 100) scale(.82)" fill="none" stroke="#14705c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{P.map(d => <path key={d} d={d} />)}</g>
            {[[-1, 84, 108], [1, 315, 130], [1, 85, 185], [-1, 322, 80]].map(([angle, x, y], index) => <path key={index} d="M-5 0H5M0-5V5" transform={`translate(${x} ${y}) rotate(${angle * 15})`} stroke="#ecd195" strokeWidth="2" strokeLinecap="round" />)}
            <g fill="#0c5748" textAnchor="middle" fontWeight="800"><text x="200" y="259" fontSize="26">NGƯỜI LAN TỎA</text><text x="200" y="289" fontSize="27">GIÁ TRỊ ĐẸP</text></g>
            <rect x="112" y="308" width="176" height="70" rx="20" fill="#e6efe6" />
            <text x="200" y="345" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0c5748">{score} / {n}</text><text x="200" y="365" textAnchor="middle" fontSize="10" letterSpacing="1" fill="#536e60">CÂU TRẢ LỜI PHÙ HỢP</text>
            <text x="200" y="406" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0c5748">{encouragement[0]}</text><text x="200" y="427" textAnchor="middle" fontSize="12" fill="#536e60">{encouragement[1]}</text>
            <path d="M150 447H250" stroke="#d9bd82" />
            <text x="200" y="466" textAnchor="middle" fontSize="10" fill="#536e60">Khu phố 19 · {new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())}</text>
            <text x="200" y="486" textAnchor="middle" fill="#6f7b6b" fontSize="9">Huy hiệu tham gia · Không phải chứng nhận</text>
          </svg>
          <div className="qact"><button className="btn dark" disabled={exporting} onClick={download}>{exporting ? 'Đang xuất…' : 'Tải huy hiệu (PNG)'} <i>↓</i></button><button className="btn dark" disabled={exporting} onClick={share}>Chia sẻ kết quả ↗</button><button className="btn dark" onClick={reset}>Làm lại</button></div><p role="status">{exportMessage}</p>
          <Link className="quiz-next-step" href="/hoc-va-lam-theo-bac#hanh-dong"><span>Mang điều đã học vào cuộc sống</span><strong>Chọn một việc nhỏ để làm hôm nay →</strong></Link>
        </div>
      )}
    </section>
  )
}
