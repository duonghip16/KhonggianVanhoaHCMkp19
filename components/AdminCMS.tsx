'use client'
import { SITE_NAME } from '@/data/site'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, type User } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getCountFromServer, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
import { firebaseAuth, firebaseDb } from '@/lib/firebase'
import { EDITORIAL_LABEL, EDITORIAL_STATUS, editorialErrors, type EditorialRecord, type EditorialStatus, type ManagedCollection } from '@/lib/editorial'
import { ADMIN_SECTIONS, adminRecords, blankRecord, csvCell } from '@/lib/admin'
import { displayDate } from '@/lib/date'
import AdminIcon from './admin/AdminIcon'
import AdminEditor from './admin/AdminEditor'
import AdminAccount from './admin/AdminAccount'
import { updateAdminRecord, transitionAdminRecords } from '@/lib/admin-mutations'

type Count = { total: number; pending: number; published: number }
const PAGE_SIZE = 12
export default function AdminCMS({ initialCollection, account = false }: { initialCollection?: ManagedCollection; account?: boolean }) {
  const col = initialCollection
  const section = ADMIN_SECTIONS.find(item => item.id === col)
  const [user, setUser] = useState<User | null>(null), [ready, setReady] = useState(false), [authorized, setAuthorized] = useState(false)
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [records, setRecords] = useState<EditorialRecord[]>([]), [record, setRecord] = useState<EditorialRecord | null>(null)
  const [baseline, setBaseline] = useState(''), [filter, setFilter] = useState<EditorialStatus | 'all'>('all')
  const [search, setSearch] = useState(''), [sort, setSort] = useState('recent'), [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([]), [counts, setCounts] = useState<Partial<Record<ManagedCollection, Count>>>({})
  const [message, setMessage] = useState(''), [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [uploading, setUploading] = useState(false), [loadError, setLoadError] = useState(false)
  const [revision, setRevision] = useState(0)
  const dirty = !!record && JSON.stringify(record) !== baseline
  const filtered = adminRecords(records, filter, search, sort)
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const locked = busy || uploading
  function discard() { return !dirty || window.confirm('Nội dung đang sửa chưa được lưu. Bỏ thay đổi để tiếp tục?') }
  function edit(item: EditorialRecord) { if (!discard()) return; setRecord(item); setBaseline(JSON.stringify(item)); setErrors([]); setMessage('') }
  function closeEditor() { if (locked || !discard()) return; setRecord(null); setErrors([]); setMessage('') }
  useEffect(() => {
    const auth = firebaseAuth(); if (!auth) { setReady(true); return }
    let version = 0
    const unsubscribe = onAuthStateChanged(auth, async next => {
      const current = ++version
      setUser(next); setAuthorized(false); setRecords([]); setRecord(null); setCounts({}); setReady(false)
      try { const admin = next ? (await next.getIdTokenResult()).claims.admin === true : false; if (current === version) setAuthorized(admin) }
      catch { if (current === version) setMessage('Không thể kiểm tra quyền quản trị. Vui lòng đăng nhập lại.') }
      finally { if (current === version) setReady(true) }
    })
    return () => { version++; unsubscribe() }
  }, [])
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status')
    setFilter(status && EDITORIAL_STATUS.includes(status as EditorialStatus) ? status as EditorialStatus : 'all')
    setRecord(null); setBaseline(''); setSearch(''); setPage(1); setErrors([]); setMessage('')
  }, [col])
  useEffect(() => { setPage(1); setSelected([]) }, [filter, search, sort])
  useEffect(() => {
    if (!dirty && !uploading) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as HTMLElement).closest?.('a'); if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const target = new URL(anchor.href); if (target.pathname === location.pathname && target.search === location.search) return
      if (uploading || !window.confirm('Nội dung chưa lưu. Bạn có muốn rời trang?')) { event.preventDefault(); event.stopPropagation() }
    }
    window.addEventListener('beforeunload', warn); document.addEventListener('click', navigate, true)
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', navigate, true) }
  }, [dirty, uploading])
  useEffect(() => {
    if (!authorized || account) return
    const db = firebaseDb(); if (!db) return
    let cancelled = false
    setLoading(true); setLoadError(false); setSelected([])
    if (col) {
      getDocs(collection(db, col)).then(result => { if (!cancelled) setRecords(result.docs.map(item => ({ ...blankRecord(), ...item.data(), id: item.id, title: item.data().title || item.data().text?.slice(0, 80) || 'Bài gửi' } as EditorialRecord))) })
        .catch(() => { if (!cancelled) { setLoadError(true); setMessage('Chưa tải được danh sách. Kiểm tra kết nối rồi thử lại.') } })
        .finally(() => { if (!cancelled) setLoading(false) })
    } else {
      Promise.allSettled(ADMIN_SECTIONS.map(async item => {
        const ref = collection(db, item.id)
        const [total, pending, published] = await Promise.all([getCountFromServer(ref), getCountFromServer(query(ref, where('status', '==', 'pending'))), getCountFromServer(query(ref, where('status', '==', 'published')))])
        return [item.id, { total: total.data().count, pending: pending.data().count, published: published.data().count }] as const
      })).then(results => {
        if (cancelled) return
        setCounts(Object.fromEntries(results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])))
        setLoadError(results.some(result => result.status === 'rejected')); setLoading(false)
      })
    }
    return () => { cancelled = true }
  }, [authorized, col, revision, account])
  async function login(event: React.FormEvent) {
    event.preventDefault(); const auth = firebaseAuth(); if (!auth || busy) return
    setBusy(true); setMessage('')
    try { await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence); await signInWithEmailAndPassword(auth, email.trim(), password); setPassword('') }
    catch { setMessage('Đăng nhập không thành công. Kiểm tra email và mật khẩu rồi thử lại.') }
    finally { setBusy(false) }
  }
  async function logout() { if (locked || !discard()) return; const auth = firebaseAuth(); try { if (auth) await signOut(auth) } catch { setMessage('Chưa đăng xuất được. Vui lòng thử lại.') } }
  async function resetPassword() {
    const auth = firebaseAuth()
    if (!auth || busy) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setMessage('Nhập email đăng nhập trước khi yêu cầu đặt lại mật khẩu.'); return }
    setBusy(true); setMessage('')
    try { await sendPasswordResetEmail(auth, email.trim()); setMessage('Nếu email có tài khoản phù hợp, hướng dẫn đặt lại mật khẩu sẽ được gửi. Kiểm tra cả thư rác.') }
    catch { setMessage('Chưa gửi được yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.') }
    finally { setBusy(false) }
  }
  async function save() {
    if (!record || !user || !authorized || !col || locked) return
    const validation = editorialErrors(col, record); setErrors(validation); if (validation.length) return
    if (record.status === 'published' && JSON.parse(baseline || '{}').status !== 'published' && !window.confirm('Xuất bản nội dung này lên website? Hãy chắc chắn đã kiểm tra nguồn, quyền sử dụng và thông tin riêng tư.')) return
    const db = firebaseDb(); if (!db) return
    setBusy(true); setMessage('')
    try {
      const { id, ...fields } = record
      const data = { ...fields, updatedAt: serverTimestamp(), updatedBy: user.uid }
      const savedId = id || (await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() })).id
      if (!id) { const created = { ...record, id: savedId }; setRecord(created); setBaseline(JSON.stringify(created)) }
      if (id) await updateAdminRecord(db, col, record, JSON.parse(baseline), user.uid)
      const snapshot = await getDoc(doc(db, col, savedId)); const saved = { ...record, ...snapshot.data(), id: savedId } as EditorialRecord
      setRecord(saved); setBaseline(JSON.stringify(saved)); setRecords(previous => [saved, ...previous.filter(item => item.id !== savedId)])
      setMessage(`Đã lưu nội dung · ${EDITORIAL_LABEL[record.status]}.`)
    } catch (error) { setMessage(error instanceof Error && error.message === 'EDIT_CONFLICT' ? 'Bài này đã được cập nhật ở nơi khác. Sao chép phần đang sửa, đóng trình biên tập và bấm Tải lại trước khi sửa tiếp.' : 'Chưa xác nhận lưu được. Giữ nội dung đang sửa và kiểm tra kết nối, quyền truy cập; tải lại danh sách trước khi tạo lại để tránh trùng bài.') }
    finally { setBusy(false) }
  }
  async function importContent() {
    if (locked || !authorized || !discard()) return
    setBusy(true); setMessage('Đang nhập tư liệu…')
    try { const { importStarterContent } = await import('@/lib/import-content'); const result = await importStarterContent(); setRevision(value => value + 1); setMessage(`Đã nhập ${result.imported} bản nháp, giữ nguyên ${result.skipped} bản đã có.`) }
    catch { setMessage('Chưa nhập được tư liệu. Kiểm tra kết nối và quyền quản trị.') }
    finally { setBusy(false) }
  }
  async function bulk(status: EditorialStatus) {
    if (!col || !user || !authorized || locked || !selected.length || !discard()) return
    if (!window.confirm(`Chuyển ${selected.length} nội dung sang ${EDITORIAL_LABEL[status]}? Trạng thái Xuất bản hiển thị công khai; các trạng thái khác ẩn nội dung khỏi website.`)) return
    const db = firebaseDb(); if (!db) return
    const items = records.filter(item => selected.includes(item.id!))
    if (items.length > 500 || items.some(item => editorialErrors(col, { ...item, status }).length)) { setMessage('Một số nội dung chưa đủ điều kiện để chuyển trạng thái. Hãy mở từng bài kiểm tra.'); return }
    setBusy(true)
    try { await transitionAdminRecords(db, col, items, status, user.uid); setRecord(null); setRevision(value => value + 1); setRecords(previous => previous.map(item => selected.includes(item.id!) ? { ...item, status } : item)); setSelected([]); setMessage(`Đã chuyển ${items.length} nội dung sang ${EDITORIAL_LABEL[status]}.`) }
    catch { setMessage('Chưa chuyển trạng thái. Có thể bài đã được sửa ở nơi khác; bấm Tải lại và kiểm tra trước khi thử lại.') }
    finally { setBusy(false) }
  }
  function exportCsv() {
    const columns = ['id', 'title', 'status', 'consent', 'category', 'type', 'date', 'name', 'text', 'source', 'verifiedBy', 'verifiedOn', 'url', 'photographer', 'permission', 'period', 'value'] as const
    const data = [columns.map(csvCell).join(','), ...filtered.map(item => columns.map(key => csvCell(item[key])).join(','))].join('\r\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF', data], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `kp19-${section?.slug || 'noi-dung'}.csv`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage(`Đã xuất ${filtered.length} nội dung theo bộ lọc hiện tại.`)
  }
  const navigation = <><Link className="adm-nav-item" href="/admin" aria-current={!col && !account ? 'page' : undefined}><AdminIcon name="home" />Tổng quan</Link><p className="adm-nav-label">Quản lý nội dung</p>{ADMIN_SECTIONS.map(item => <Link key={item.id} data-collection={item.id} className="adm-nav-item" href={`/admin/${item.slug}`} aria-current={col === item.id ? 'page' : undefined}><AdminIcon name={item.icon} />{item.label}</Link>)}<p className="adm-nav-label">Tài khoản</p><Link className="adm-nav-item" href="/admin/tai-khoan" aria-current={account ? 'page' : undefined}><AdminIcon name="shield" />Tài khoản & mật khẩu</Link></>
  const brand = <Link href="/admin" className="adm-brand"><Image src="/logos/LOGO_KP19-transparent.png" width={44} height={44} alt="Logo Khu phố 19" /><span><strong>{SITE_NAME}</strong><small>Quản trị nội dung</small></span></Link>
  if (!ready) return <main id="main" className="adm-loading"><Image src="/logos/LOGO_KP19-transparent.png" width={64} height={64} alt="Logo Khu phố 19" /><h1>Không gian quản trị</h1><p role="status">Đang kiểm tra phiên đăng nhập…</p></main>
  if (!firebaseAuth()) return <main id="main" className="adm-loading"><h1>Quản trị chưa kết nối</h1><p>Cần cấu hình Firebase Web App để đăng nhập.</p><Link href="/">Về website</Link></main>
  if (!user) return <main id="main" className="adm-login"><div className="adm-login-story">{brand}<div><p className="adm-kicker">Không gian quản trị</p><h1>Giữ gìn tư liệu.<br />Lan tỏa giá trị.</h1><p>Một nơi để biên tập, xác minh và chia sẻ những điều tốt đẹp của cộng đồng Khu phố 19.</p></div><span>{SITE_NAME}</span></div><div className="adm-login-panel"><form onSubmit={login}><div className="adm-login-mark"><AdminIcon name="shield" size={28} /></div><p className="adm-kicker">Chào mừng trở lại</p><h2>Đăng nhập quản trị</h2><p>Dùng tài khoản được cấp quyền để tiếp tục.</p><label className="adm-field"><span>Email</span><input type="email" required autoComplete="username" placeholder="Email của bạn" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label><label className="adm-field"><span>Mật khẩu</span><div className="adm-password"><input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /><button type="button" className="adm-icon-button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}><AdminIcon name="eye" /></button></div></label><label className="adm-remember"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} disabled={busy} /> Giữ đăng nhập trên thiết bị này</label><button className="adm-button" type="submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}<AdminIcon name="arrow" /></button>{message && <p className="adm-alert error" role="alert">{message}</p>}<button className="adm-reset-password" type="button" disabled={busy} onClick={() => void resetPassword()}>Quên mật khẩu?</button><Link className="adm-login-back" href="/">← Quay lại website</Link></form></div></main>
  const complete = ADMIN_SECTIONS.every(item => !!counts[item.id])
  const totals = complete ? Object.values(counts).reduce((sum, item) => ({ total: sum.total + item.total, pending: sum.pending + item.pending, published: sum.published + item.published }), { total: 0, pending: 0, published: 0 }) : null
  return <div className="admin-app"><aside className="adm-sidebar">{brand}<span className="adm-workspace-tag">Biên tập & xác minh</span><nav aria-label="Điều hướng quản trị">{navigation}</nav><div className="adm-sidebar-footer"><Link href="/" target="_blank" rel="noopener noreferrer"><AdminIcon name="arrow" />Mở website</Link></div></aside>
    <div className="adm-workspace"><header className="adm-topbar"><div className="adm-breadcrumb">Quản trị <span>/</span><strong>{section?.label || (account ? 'Tài khoản' : 'Tổng quan')}</strong></div><div className="adm-topbar-tools"><Link href="/" target="_blank" rel="noopener noreferrer" className="adm-website-link">Xem website ↗</Link><Link href="/admin/tai-khoan" className="adm-user" title={user.email || ''}><span>{(user.email || 'A')[0].toUpperCase()}</span><div><strong>Quản trị viên</strong><small>{user.email}</small></div></Link><button className="adm-icon-button" aria-label="Đăng xuất" disabled={locked} onClick={() => void logout()}><AdminIcon name="logout" /></button><details className="adm-mobile-menu" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}><summary aria-label="Menu quản trị"><AdminIcon name="menu" /></summary><nav aria-label="Quản trị trên điện thoại" onClick={event => { if ((event.target as HTMLElement).closest('a')) event.currentTarget.closest('details')?.removeAttribute('open') }}>{navigation}</nav></details></div></header>
      <main id="main" className="adm-main">{!authorized ? <div className="adm-panel"><AdminIcon name="shield" size={32} /><h1>Tài khoản chưa có quyền quản trị</h1><p>Liên hệ người quản lý dự án để được cấp quyền truy cập.</p></div> : <>
        <div className="adm-page-heading"><div><p className="adm-kicker">{account ? 'Cài đặt cá nhân' : col ? 'Không gian biên tập' : 'Không gian quản trị'}</p><h1>{section?.label || (account ? 'Tài khoản & mật khẩu' : 'Tổng quan nội dung')}</h1><p>{section?.description || (account ? 'Thông tin đăng nhập và bảo vệ tài khoản của bạn.' : 'Theo dõi nội dung, xử lý bài gửi và chuẩn bị tư liệu để công bố.')}</p></div>{!account && <div className="adm-heading-actions"><button className="adm-button secondary" disabled={locked || loading} onClick={() => { if (discard()) setRevision(value => value + 1) }}><AdminIcon name="refresh" />Tải lại</button>{col && <button className="adm-button" disabled={locked || loading} onClick={() => edit(blankRecord())}><AdminIcon name="plus" />Tạo nội dung</button>}</div>}</div>
        {message && !record && <div className="adm-alert" role="status">{message}</div>}
        {loadError && <div className="adm-alert error" role="alert">Chưa tải đủ dữ liệu. Bấm Tải lại để thử lại; số chưa đọc được không được tính thành 0.</div>}
        {account ? <AdminAccount user={user} /> : !col ? <>
          <div className="adm-stat-grid">{[['Tổng nội dung', totals?.total, 'Tất cả danh mục', 'library'], ['Chờ xác minh', totals?.pending, 'Cần đối chiếu trước khi đăng', 'shield'], ['Đã xuất bản', totals?.published, 'Đang hiển thị công khai', 'check'], ['Danh mục quản lý', ADMIN_SECTIONS.length, 'Nội dung & tương tác', 'chart']].map(([label, value, description, icon]) => <div className="adm-stat" key={String(label)}><div><span>{label}</span><AdminIcon name={String(icon)} /></div><strong>{value === undefined || value === null ? '—' : Number(value).toLocaleString('vi-VN')}</strong><small>{loading && value === undefined ? 'Đang tải dữ liệu…' : description}</small></div>)}</div>
          <div className="adm-dashboard-grid"><section className="adm-panel"><div className="adm-panel-heading"><div><h2>Danh mục nội dung</h2><p>Số liệu lấy trực tiếp từ database.</p></div><span className="adm-badge neutral">{ADMIN_SECTIONS.length} danh mục</span></div><div className="adm-category-list">{ADMIN_SECTIONS.map(item => <Link key={item.id} href={`/admin/${item.slug}`} className="adm-category-row"><span className="adm-category-icon"><AdminIcon name={item.icon} /></span><div><strong>{item.label}</strong><small>{counts[item.id] ? `${counts[item.id]!.pending} chờ xác minh · ${counts[item.id]!.published} đã xuất bản` : loading ? 'Đang tải…' : 'Chưa tải được số liệu'}</small></div><b>{counts[item.id]?.total ?? '—'}</b><AdminIcon name="arrow" size={16} /></Link>)}</div></section>
            <div className="adm-dashboard-aside"><section className="adm-panel adm-review-card"><p className="adm-kicker">Ưu tiên hôm nay</p><h2>Xét duyệt bài gửi</h2><p>Đọc, kiểm tra thông tin riêng tư và đối chiếu trước khi công bố.</p><Link className="adm-button" href="/admin/viec-tot?status=pending"><AdminIcon name="heart" />Việc tốt chờ xác minh</Link><Link className="adm-button secondary" href="/admin/loi-nhan?status=pending"><AdminIcon name="message" />Lời nhắn chờ xác minh</Link></section><section className="adm-panel"><div className="adm-section-title"><h2>Bộ tư liệu khởi đầu</h2><p>Thư viện có nguồn, quiz và thử thách. Nhập dưới dạng Nháp; giữ nguyên nội dung đã có.</p></div><button className="adm-button secondary" disabled={locked || loading} onClick={() => void importContent()}><AdminIcon name="download" />{busy ? 'Đang nhập…' : 'Nhập bộ tư liệu'}</button></section><section className="adm-guidance"><AdminIcon name="shield" /><div><strong>Nguồn rõ ràng. Công bố có căn cứ.</strong><p>Không tự tạo số liệu hay thành tích. Ảnh cần quyền sử dụng; bài gửi cần được duyệt.</p></div></section></div>
          </div>
        </> : <>
          <div className="adm-collection-stats">{(['all', ...EDITORIAL_STATUS] as const).map(status => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}><span>{status === 'all' ? 'Tất cả nội dung' : EDITORIAL_LABEL[status]}</span><strong>{loading && !records.length ? '—' : status === 'all' ? records.length : records.filter(item => item.status === status).length}</strong></button>)}</div>
          <section className="adm-panel adm-content-panel"><div className="adm-table-toolbar"><label className="adm-search"><AdminIcon name="search" /><input type="search" aria-label="Tìm nội dung" placeholder="Tìm tiêu đề, nội dung, nguồn…" value={search} onChange={event => setSearch(event.target.value)} /></label><label className="adm-sort"><span>Sắp xếp</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="recent">Ngày mới nhất</option><option value="title">Tiêu đề A–Z</option></select></label><button className="adm-button secondary" disabled={!filtered.length || loading || locked} onClick={exportCsv}><AdminIcon name="download" />Xuất CSV</button></div>
            {selected.length > 0 && <div className="adm-bulk"><strong>Đã chọn {selected.length} nội dung</strong><button disabled={locked} onClick={() => void bulk('draft')}>Chuyển về Nháp</button><button disabled={locked} onClick={() => void bulk('pending')}>Chờ xác minh</button><button disabled={locked} onClick={() => void bulk('verified')}>Đã xác minh</button><button disabled={locked} onClick={() => void bulk('published')}>Xuất bản</button><button onClick={() => setSelected([])}>Bỏ chọn</button></div>}
            {loading ? <div className="adm-table-loading" role="status"><AdminIcon name="refresh" /><p>Đang tải nội dung…</p></div> : !filtered.length ? <div className="adm-empty"><AdminIcon name={section?.icon || 'book'} size={40} /><h2>{loadError ? 'Dữ liệu chưa tải được' : records.length ? 'Chưa tìm thấy nội dung' : 'Danh mục đang chờ nội dung'}</h2><p>{loadError ? 'Thử tải lại khi kết nối ổn định.' : records.length ? 'Thử từ khóa khác hoặc xóa bộ lọc.' : 'Tạo bản nháp đầu tiên và bổ sung nguồn trước khi công bố.'}</p>{records.length > 0 && <button className="adm-button secondary" onClick={() => { setSearch(''); setFilter('all') }}>Xóa bộ lọc</button>}</div> : <>
              <div className="adm-table-wrap"><table className="adm-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả trên trang này" checked={rows.length > 0 && rows.every(item => selected.includes(item.id!))} disabled={locked} onChange={event => setSelected(event.target.checked ? Array.from(new Set([...selected, ...rows.map(item => item.id!)])) : selected.filter(id => !rows.some(item => item.id === id)))} /></th><th>Nội dung</th><th>Trạng thái</th><th>{col === 'library' ? 'Loại tư liệu' : 'Chủ đề'}</th><th>Ngày</th><th><span className="adm-sr-only">Thao tác</span></th></tr></thead><tbody>{rows.map(item => <tr key={item.id}><td><input type="checkbox" aria-label={`Chọn ${item.title}`} checked={selected.includes(item.id!)} disabled={locked} onChange={event => setSelected(previous => event.target.checked ? [...previous, item.id!] : previous.filter(id => id !== item.id))} /></td><td className="adm-title-cell"><button data-edit={item.id} onClick={() => edit(item)} disabled={locked}>{item.title}</button><small>{col === 'deeds' || col === 'messages' ? `${item.name || 'Ẩn danh'} · ${item.consent === true ? 'Đã đồng ý công khai' : 'Chưa có sự đồng ý'}` : item.source || 'Nguồn chờ cập nhật'}</small></td><td><span className={`adm-badge ${item.status}`}>{EDITORIAL_LABEL[item.status]}</span></td><td className="adm-category-cell">{col === 'library' ? item.type : item.category || '—'}</td><td className="adm-date-cell">{item.createdAt?.seconds ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(item.createdAt.seconds * 1000)) : displayDate(item.date || item.verifiedOn) || '—'}</td><td><button className="adm-row-edit" onClick={() => edit(item)} disabled={locked} aria-label={`Biên tập ${item.title}`}>Biên tập <AdminIcon name="arrow" size={16} /></button></td></tr>)}</tbody></table></div>
              <div className="adm-pagination"><p>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} nội dung</p><div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>← Trước</button><span>Trang {currentPage} / {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Sau →</button></div></div>
            </>}
          </section><p className="adm-list-note"><AdminIcon name="shield" size={16} />Chỉ nội dung Đã xuất bản được hiển thị trên website. Chuyển về Nháp để tạm ẩn; không xóa tư liệu gốc.</p>
        </>}
      </>}</main><footer className="adm-footer"><span>{SITE_NAME}</span><Link href="/thu-vien" target="_blank" rel="noopener noreferrer">Thư viện tư liệu ↗</Link></footer>
    </div>
    {record && col && authorized && <AdminEditor key={record.id || 'new'} record={record} collection={col} busy={busy} uploading={uploading} dirty={dirty} message={message} errors={errors} onChange={value => { setRecord(value); setErrors([]) }} onClose={closeEditor} onSave={save} onUpload={setUploading} onMessage={setMessage} />}
  </div>
}
