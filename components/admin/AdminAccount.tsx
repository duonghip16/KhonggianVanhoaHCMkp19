'use client'
import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, type User } from 'firebase/auth'
import AdminIcon from './AdminIcon'

export default function AdminAccount({ user }: { user: User }) {
  const [current, setCurrent] = useState(''), [next, setNext] = useState(''), [repeat, setRepeat] = useState('')
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('')
  async function change(event: React.FormEvent) {
    event.preventDefault(); if (busy || !user.email) return
    if (next.length < 12 || next !== repeat || next === current) { setMessage('Mật khẩu mới cần ít nhất 12 ký tự, khác mật khẩu hiện tại và trùng phần nhập lại.'); return }
    setBusy(true); setMessage('')
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current))
      await updatePassword(user, next)
      setCurrent(''); setNext(''); setRepeat(''); setMessage('Đã đổi mật khẩu. Dùng mật khẩu mới cho những lần đăng nhập tiếp theo.')
    } catch { setMessage('Chưa đổi được mật khẩu. Kiểm tra mật khẩu hiện tại và kết nối, rồi thử lại.') }
    finally { setBusy(false) }
  }
  return <div className="adm-account-grid"><section className="adm-panel"><div className="adm-section-title"><AdminIcon name="shield" size={28} /><h2>Tài khoản quản trị</h2><p>Tài khoản có quyền biên tập và xét duyệt nội dung.</p></div><dl className="adm-account-info"><div><dt>Email đăng nhập</dt><dd>{user.email}</dd></div><div><dt>Quyền truy cập</dt><dd><span className="adm-badge published">Quản trị viên</span></dd></div><div><dt>Dữ liệu nội dung</dt><dd>Firebase Firestore</dd></div><div><dt>Lưu ảnh</dt><dd>ImageKit</dd></div></dl><p className="adm-help">Chỉ công bố nội dung có nguồn, thông tin xác minh và quyền sử dụng phù hợp. Không chia sẻ tài khoản quản trị cho người không được phân quyền.</p></section>
    <form className="adm-panel" onSubmit={change}><div className="adm-section-title"><h2>Đổi mật khẩu</h2><p>Xác nhận mật khẩu hiện tại trước khi thay đổi.</p></div><fieldset disabled={busy} className="adm-editor-fields"><label className="adm-field"><span>Mật khẩu hiện tại</span><input type="password" autoComplete="current-password" required value={current} onChange={event => setCurrent(event.target.value)} /></label><label className="adm-field"><span>Mật khẩu mới</span><input type="password" autoComplete="new-password" required minLength={12} value={next} onChange={event => setNext(event.target.value)} /><small>Ít nhất 12 ký tự. Dùng mật khẩu riêng cho tài khoản này.</small></label><label className="adm-field"><span>Nhập lại mật khẩu mới</span><input type="password" autoComplete="new-password" required minLength={12} value={repeat} onChange={event => setRepeat(event.target.value)} /></label><button className="adm-button" type="submit"><AdminIcon name="shield" />{busy ? 'Đang cập nhật…' : 'Đổi mật khẩu'}</button></fieldset><p className="adm-form-status" role="status">{message}</p></form>
  </div>
}
