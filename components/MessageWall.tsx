'use client'
import { useEffect, useState } from 'react'
import { fetchPublished, submit } from '@/lib/submit'

export default function MessageWall() {
  const [notes, setNotes] = useState<{ text: string; name: string }[]>([])
  const [text, setText] = useState(''); const [name, setName] = useState('')
  const [res, setRes] = useState<'' | 'saved' | 'local' | 'limited' | 'error'>('')
  const [sending, setSending] = useState(false)
  const [loadError, setLoadError] = useState(false), [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; fetchPublished('messages').then(items => { if (!active) return; setLoading(false); if (items === null) setLoadError(true); else setNotes(items) }); return () => { active = false } }, [])
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!text.trim() || sending) return
    setSending(true)
    setRes('')
    const result = await submit('messages', { text: text.trim(), name: name.trim() })
    setRes(result); setSending(false)
    if (result === 'saved') { setText(''); setName('') }
  }
  return (
    <section className="wall on-light" id="loi-nhan" aria-labelledby="hw">
      <p className="eyebrow">Lời nhắn</p>
      <h2 id="hw">Một lời nhắn gửi Khu phố 19</h2>
      {loading ? <p role="status">Đang tải lời nhắn…</p> : loadError ? <p role="alert">Chưa tải được lời nhắn. Vui lòng thử tải lại trang.</p> : notes.length === 0 ? (
        <div className="empty"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg><p>Chưa có lời nhắn nào được công bố. Hãy là người viết lời đầu tiên.</p></div>
      ) : (
        <ul className="notes">{notes.map((n, i) => <li key={i} style={{ ['--r' as string]: ((i % 3) - 1) * 1.2 + 'deg' }}><p>{n.text}</p><small>{n.name || 'Một người bạn'}</small></li>)}</ul>
      )}
      <form className="gform light" onSubmit={send}>
        <div><label htmlFor="mn">Tên (có thể bỏ trống)</label><input id="mn" maxLength={60} value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label htmlFor="mt">Lời nhắn của bạn</label><textarea id="mt" required maxLength={400} value={text} onChange={e => setText(e.target.value)} /></div>
        <p>Nội dung và tên hiển thị sẽ được công khai sau khi duyệt.</p><label><input type="checkbox" required /> Tôi đồng ý gửi nội dung để xét duyệt và đăng công khai.</label>
        <button className="btn dark" type="submit" disabled={sending}>{sending ? 'Đang gửi…' : 'Gửi lời nhắn'} <i>→</i></button>
      </form>
      {res && <p className="sent" role="status">{res === 'saved' ? 'Đã gửi. Lời nhắn sẽ xuất hiện sau khi được duyệt.' : res === 'limited' ? 'Bạn gửi quá nhanh. Vui lòng chờ ít nhất một phút rồi thử lại. Nội dung vẫn được giữ lại.' : res === 'local' ? 'Chưa kết nối Firebase. Lời nhắn chưa được gửi.' : 'Chưa gửi được. Nội dung được giữ lại để bạn thử lại.'}</p>}
    </section>
  )
}
