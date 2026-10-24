'use client'
import { useEffect, useRef, useState } from 'react'
import { fetchPublished, submit } from '@/lib/submit'
import { displayDate } from '@/lib/date'

type Deed = { t: string; n: string; title: string; date: string } | null
const sizes = [64, 84, 72, 96, 68, 80, 76, 88]

export default function Garden() {
  const [fl, setFl] = useState<Deed[]>(Array(8).fill(null))
  const [sel, setSel] = useState<number | null>(null)
  const [ok, setOk] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [title, setTitle] = useState(''), [date, setDate] = useState('')
  const btns = useRef<(HTMLButtonElement | null)[]>([])
  const dialog = useRef<HTMLDialogElement>(null)

  const [res, setRes] = useState<'' | 'saved' | 'local' | 'limited' | 'error'>('')
  const [sending, setSending] = useState(false)
  const [loadError, setLoadError] = useState(false), [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; fetchPublished('deeds').then(d => { if (!active) return; setLoading(false); if (d === null) setLoadError(true); else if (d.length) setFl(Array.from({ length: Math.max(8, d.length) }, (_, i) => d[i] ? { t: d[i].text, n: d[i].name, title: d[i].title, date: d[i].date } : null)) }); return () => { active = false } }, [])
  const close = () => { const i = sel; setSel(null); if (i !== null) btns.current[i]?.focus() }
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (sel !== null && !element.open) element.showModal()
    if (sel === null && element.open) element.close()
  }, [sel])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim(); if (!t || sending) return
    setSending(true)
    setRes(''); setOk(0)
    const result = await submit('deeds', { text: t, name: name.trim(), title: title.trim(), date })
    setRes(result); setSending(false)
    if (result !== 'saved') return
    setOk(o => o + 1); setText(''); setName(''); setTitle(''); setDate('')
  }
  const cur = sel !== null ? fl[sel] : null

  return (
    <section className="garden grain" id="vuon-hoa" aria-labelledby="hg">
      <p className="eyebrow">Tương tác</p>
      <h2 id="hg">Vườn hoa việc tốt</h2>
      <p className="gq">Mỗi việc tốt – Một bông hoa đẹp.</p>
      {loading && <p role="status">Đang mở khu vườn…</p>}{loadError && <p role="alert">Chưa tải được các việc tốt. Vui lòng thử tải lại trang.</p>}
      <ul className="field" aria-label="Vườn hoa việc tốt">
        {fl.map((f, i) => (
          <li key={i}><button type="button" ref={el => { btns.current[i] = el }}
            className={'fl' + (f ? ' full' : '')}
            style={{ ['--s' as string]: sizes[i % sizes.length] + 'px' }}
            aria-label={f ? `Hoa việc tốt của ${f.n || 'một người'}` : `Ô hoa số ${i + 1}: chưa có việc tốt`}
            onClick={() => setSel(i)}>
            <svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg>
            <span>{f ? f.n || 'Một việc tốt' : 'Chưa có việc tốt'}</span>
          </button></li>
        ))}
      </ul>
      <form className="gform" onSubmit={send}>
        <div><label htmlFor="gn">Tên của bạn (có thể bỏ trống)</label><input id="gn" maxLength={60} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label htmlFor="gtitle">Tên việc tốt</label><input id="gtitle" required maxLength={200} value={title} onChange={event => setTitle(event.target.value)} /></div>
        <div><label htmlFor="gdate">Ngày thực hiện</label><input id="gdate" type="date" required value={date} onChange={event => setDate(event.target.value)} /></div>
        <div><label htmlFor="gt">Việc tốt bạn muốn chia sẻ</label><textarea id="gt" required maxLength={400} value={text} onChange={e => setText(e.target.value)} /></div>
        <p>Nội dung và tên hiển thị sẽ được công khai sau khi duyệt.</p><label><input type="checkbox" required /> Tôi đồng ý gửi nội dung để xét duyệt và đăng công khai.</label>
        <button className="btn" type="submit" disabled={sending}>{sending ? 'Đang gửi…' : 'Gửi một việc tốt'} <i>→</i></button>
      </form>
      {res === 'limited' && <p role="status">Bạn gửi quá nhanh. Vui lòng chờ ít nhất một phút rồi thử lại. Nội dung của bạn vẫn được giữ lại.</p>}
      {res === 'error' && <p role="alert">Chưa gửi được. Nội dung được giữ lại để bạn thử lại.</p>}
      {res === 'local' && <p role="status">Chưa kết nối Firebase. Bài chưa được gửi; vui lòng quay lại sau.</p>}
      {ok > 0 && (
        <div className="success show" key={ok} role="status" aria-live="polite">
          <svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg>
          <p>Cảm ơn bạn đã góp thêm một bông hoa đẹp cho cộng đồng.</p>
          <small>Nội dung sẽ được xem xét trước khi công bố.</small>
        </div>
      )}
      <dialog ref={dialog} className="deed-dialog" aria-labelledby="deed-title" onCancel={close} onClose={() => { if (sel !== null) close() }}>
        <button className="dialog-close" onClick={close} aria-label="Đóng">×</button>
        <p className="eyebrow">Vườn hoa việc tốt</p><h3 id="deed-title">{cur ? cur.title || 'Một việc tốt' : 'Ô hoa còn trống'}</h3>
        {cur && <p>{cur.n || 'Một người bạn'}{cur.date && ` · ${displayDate(cur.date)}`}</p>}
        <p>{cur ? cur.t : 'Chưa có việc tốt nào được công bố tại ô này.'}</p>
      </dialog>
    </section>
  )
}
