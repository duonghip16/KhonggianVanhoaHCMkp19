'use client'
import { useEffect, useRef, useState } from 'react'
import { EDITORIAL_LABEL, EDITORIAL_STATUS, safeUrl, type EditorialRecord, type ManagedCollection } from '@/lib/editorial'
import { managedLibraryItem } from '@/lib/managed-library'
import MediaPreview from '@/components/MediaPreview'
import ReadingDialog from '@/components/ReadingDialog'
import SourceReference from '@/components/SourceReference'
import AdminIcon from './AdminIcon'

type Props = {
  record: EditorialRecord; collection: ManagedCollection; busy: boolean; uploading: boolean; dirty: boolean;
  message: string; errors: string[]; onChange: (record: EditorialRecord) => void; onClose: () => void;
  onSave: () => Promise<void>; onUpload: (state: boolean) => void; onMessage: (message: string) => void;
}
export default function AdminEditor({ record, collection: col, busy, uploading, dirty, message, errors, onChange, onClose, onSave, onUpload, onMessage }: Props) {
  const modal = useRef<HTMLDialogElement>(null)
  const [tab, setTab] = useState('content')
  const [reading, setReading] = useState(false)
  const image = col === 'media' || (col === 'library' && ['Hình ảnh', 'Infographic'].includes(record.type))
  const preview = col === 'library' && safeUrl(record.url) ? managedLibraryItem({ ...record, id: record.id || 'preview', status: 'published' }) : null
  useEffect(() => {
    const element = modal.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    element?.showModal()
    return () => { document.body.style.overflow = previousOverflow; element?.close(); if (previousFocus?.isConnected) previousFocus.focus() }
  }, [])
  useEffect(() => {
    if (!errors.length) return
    setTab(errors.some(error => /đồng ý|tiêu đề|nội dung|quiz|kỳ báo cáo|số liệu/i.test(error)) ? 'content' : errors.some(error => /ảnh|đường dẫn|quyền đăng|quyền sử dụng/i.test(error)) ? 'media' : 'verification')
  }, [errors])
  const field = (key: keyof EditorialRecord, label: string, type = 'text', help = '') => <label className="adm-field" key={key}><span>{label}</span><input type={type} value={String(record[key] ?? '')} maxLength={key === 'title' ? 200 : key === 'name' ? 60 : 2000} min={type === 'number' ? 0 : undefined} onChange={event => onChange({ ...record, [key]: type === 'number' ? Number(event.target.value) : event.target.value })} />{help && <small>{help}</small>}</label>
  async function upload(input: HTMLInputElement) {
    const file = input.files?.[0]; if (!file) return
    onUpload(true); onMessage('Đang tải ảnh lên ImageKit…')
    try { const { uploadMedia } = await import('@/lib/upload'); const url = await uploadMedia(file); onChange({ ...record, url }); onMessage('Ảnh đã tải lên ImageKit. Lưu nội dung để lưu URL trong Firestore.') }
    catch (error) { onMessage(error instanceof Error ? error.message : 'Chưa tải được ảnh. Vui lòng thử lại.') }
    finally { onUpload(false); input.value = '' }
  }
  return <>
    <dialog ref={modal} className="adm-editor" aria-labelledby="admin-editor-title" onCancel={event => { event.preventDefault(); if (!busy && !uploading) onClose() }}>
      <form onSubmit={event => { event.preventDefault(); void onSave() }}>
        <header className="adm-editor-header"><div><p className="adm-kicker">{record.id ? 'Biên tập nội dung' : 'Tạo nội dung mới'}</p><h2 id="admin-editor-title">{record.title || 'Bản nháp mới'}</h2><span className="adm-editor-state">{dirty ? 'Có thay đổi chưa lưu' : record.id ? 'Đã lưu' : 'Chưa lưu'}{record.id && ` · ID: ${record.id}`}</span></div><button className="adm-icon-button" type="button" disabled={busy || uploading} onClick={onClose} aria-label="Đóng trình biên tập"><AdminIcon name="close" /></button></header>
        <div className="adm-editor-tabs" role="group" aria-label="Phần biên tập">{[['content', 'Nội dung'], ['media', 'Tư liệu & ảnh'], ['verification', 'Xác minh'], ['preview', 'Xem trước']].map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div>
        <div className="adm-editor-scroll">
          {errors.length > 0 && <div className="adm-alert error" role="alert"><strong>Kiểm tra nội dung trước khi lưu</strong><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
          <fieldset disabled={busy || uploading} className="adm-editor-fields">
            {tab === 'content' && <>
              {(col === 'deeds' || col === 'messages') && <div className="adm-alert"><strong>{record.consent === true ? 'Người gửi đã đồng ý xét duyệt và công khai.' : 'Chưa có xác nhận đồng ý công khai.'}</strong><p>Kiểm tra thông tin riêng tư trước khi duyệt. Chỉ xác nhận khi đã có sự đồng ý của người gửi.</p><label><input type="checkbox" checked={record.consent === true} onChange={event => onChange({ ...record, consent: event.target.checked })} /> Đã có sự đồng ý qua biểu mẫu hoặc căn cứ lưu kèm.</label></div>}
              <div className="adm-section-title"><h3>Nội dung chính</h3><p>Viết rõ ràng, đúng tư liệu và phù hợp với người đọc.</p></div>
              {field('title', col === 'quiz_questions' ? 'Câu hỏi' : col === 'media' ? 'Tên ảnh / sự kiện' : 'Tiêu đề')}
              {col !== 'media' && col !== 'site_stats' && <label className="adm-field"><span>{col === 'quiz_questions' ? 'Giải thích đáp án' : 'Nội dung'}</span><textarea rows={8} maxLength={col === 'deeds' || col === 'messages' ? 400 : 20000} value={record.text} onChange={event => onChange({ ...record, text: event.target.value })} /><small>{record.text.length.toLocaleString('vi-VN')} / {col === 'deeds' || col === 'messages' ? '400' : '20.000'} ký tự{record.curatedId && ' · Tư liệu liên kết: phần này là giới thiệu; bài đọc đầy đủ dùng bộ tư liệu đã biên soạn.'}</small></label>}
              <div className="adm-two-fields">{(col === 'deeds' || col === 'messages') && field('name', 'Tên hiển thị')}{['stories', 'activities', 'media', 'deeds'].includes(col) && field('date', 'Ngày sự kiện / thực hiện', 'date')}{['stories', 'activities', 'daily_challenges'].includes(col) && field('category', 'Chủ đề / nhóm giá trị')}</div>
              {col === 'library' && <label className="adm-field"><span>Loại tư liệu</span><select value={record.type} onChange={event => onChange({ ...record, type: event.target.value })}>{['Sách', 'Hình ảnh', 'Video', 'Audio', 'Infographic', 'Tài liệu'].map(type => <option key={type}>{type}</option>)}</select></label>}
              {col === 'quiz_questions' && <><label className="adm-field"><span>Đáp án · mỗi dòng một đáp án</span><textarea rows={4} maxLength={2000} value={record.options || ''} onChange={event => onChange({ ...record, options: event.target.value })} /><small>2–4 lựa chọn. Thay đổi đáp án cần kiểm tra lại lựa chọn đúng.</small></label><label className="adm-field"><span>Đáp án đúng</span><select value={record.correct ?? 0} onChange={event => onChange({ ...record, correct: Number(event.target.value) })}>{(record.options || '').split('\n').map(option => option.trim()).filter(Boolean).map((option, index) => <option key={index} value={index}>{index + 1}. {option}</option>)}</select></label></>}
              {col === 'site_stats' && <><p className="adm-alert">Chỉ nhập số liệu đã được xác minh. Giá trị 0 cũng cần báo cáo và kỳ thống kê làm căn cứ.</p><div className="adm-two-fields">{field('value', 'Giá trị', 'number')}{field('period', 'Kỳ báo cáo')}</div><label className="adm-field"><span>Chỉ số</span><select value={record.category} onChange={event => onChange({ ...record, category: event.target.value })}><option value="">Chọn chỉ số</option><option value="activities">Hoạt động</option><option value="participants">Người tham gia</option><option value="deeds">Việc tốt</option><option value="households">Hộ được hỗ trợ</option></select></label></>}
            </>}
            {tab === 'media' && <><div className="adm-section-title"><h3>Tư liệu & quyền sử dụng</h3><p>Giữ lại nguồn gốc và căn cứ cho phép công bố.</p></div>
              {['library', 'media'].includes(col) ? <>{field('url', 'URL tư liệu', 'text', 'HTTPS hoặc đường dẫn trong website. Thư viện hỗ trợ ảnh, PDF, audio/video và YouTube.')}{image && <><label className="adm-upload"><AdminIcon name="image" size={32} /><strong>Chọn ảnh từ thiết bị</strong><span>JPG, PNG, WebP, AVIF · tối đa 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => void upload(event.currentTarget)} />{uploading && <span role="status">Đang tải ảnh…</span>}</label><MediaPreview url={record.url} title={record.title} />{field('photographer', 'Người chụp / đơn vị sở hữu')}{field('permission', 'Căn cứ quyền sử dụng', 'text', 'Văn bản đồng ý, giấy phép và phạm vi được đăng.')}</>}
                {col === 'media' && <>{field('category', 'Vị trí hiển thị', 'text', 'hero, bento-1…bento-4, before, after, story:ID hoặc gallery:ID.')}<p className="adm-help">Ảnh trang chủ: bento-1 = Câu chuyện nổi bật; bento-2 = An sinh; bento-3 = Môi trường; bento-4 = Người tốt, việc tốt. Tên ảnh là chú thích hiển thị. Ảnh chỉ thay ảnh dự phòng sau khi Xuất bản.</p><p className="adm-help">URL ImageKit có thể xem công khai ngay khi upload. Trạng thái Nháp chỉ kiểm soát việc đưa ảnh vào website.</p></>}
              </> : <><p className="adm-alert">Ảnh bìa và ảnh bổ sung được quản lý ở Kho ảnh để có đầy đủ nguồn và quyền đăng.</p>{record.id && col === 'stories' && <p className="adm-help">Ảnh bìa: <code>story:{record.id}</code><br />Ảnh bổ sung: <code>gallery:{record.id}</code></p>}<p>Hãy lưu nội dung trước khi chuyển tới Kho ảnh.</p></>}
            </>}
            {tab === 'verification' && <><div className="adm-section-title"><h3>Hồ sơ xác minh</h3><p>Nội dung được xác minh trước khi công khai. Không tự điền căn cứ chưa có.</p></div>{field('source', 'Nguồn / báo cáo / căn cứ')}{field('verifiedBy', 'Người xác minh')}{field('verifiedOn', 'Ngày xác minh', 'date')}<p className="adm-help">Xuất bản yêu cầu đủ nguồn, người và ngày xác minh; ảnh cần quyền sử dụng, số liệu cần kỳ báo cáo.</p></>}
            {tab === 'preview' && <article className="adm-content-preview"><p className="adm-kicker">Xem trước · chưa thay đổi trạng thái</p><h3>{record.title || 'Chưa có tiêu đề'}</h3>{image && <MediaPreview url={record.url} title={record.title} />}{record.text.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{record.source && <div className="adm-preview-source"><strong>Nguồn</strong><p><SourceReference text={record.source} /></p></div>}{preview && <button type="button" className="adm-button secondary" onClick={() => setReading(true)}><AdminIcon name="eye" />Mở trình xem tư liệu</button>}{!record.text && !image && <p>Nội dung xem trước sẽ xuất hiện khi bạn điền bản đọc.</p>}</article>}
          </fieldset>
        </div>
        <footer className="adm-editor-footer"><label className="adm-field"><span>Trạng thái công bố</span><select aria-label="Trạng thái công bố" value={record.status} disabled={busy || uploading} onChange={event => onChange({ ...record, status: event.target.value as EditorialRecord['status'] })}>{EDITORIAL_STATUS.map(status => <option key={status} value={status}>{EDITORIAL_LABEL[status]}</option>)}</select></label><div className="adm-editor-actions"><button className="adm-button secondary" type="button" disabled={busy || uploading} onClick={onClose}>Đóng</button><button className="adm-button" type="submit" disabled={busy || uploading}><AdminIcon name="check" />{busy ? 'Đang lưu…' : 'Lưu nội dung'}</button></div>{message && <p className="adm-editor-message" role="status">{message}</p>}</footer>
      </form>
    </dialog>
    <ReadingDialog preview={reading ? preview : null} onDismiss={() => setReading(false)} />
  </>
}
