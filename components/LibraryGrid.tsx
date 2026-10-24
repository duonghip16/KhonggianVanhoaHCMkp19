'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LIB_TYPES, type LibItem, type LibType } from '@/data/content'
import { filterLibrary, prepareLibrary } from '@/lib/library'
import ReadingDialog from './ReadingDialog'
import LibraryCover from './LibraryCover'

const ACTIONS: Record<LibType, string> = {
  'Sách': 'Mở sách', 'Hình ảnh': 'Xem ảnh', 'Video': 'Xem video',
  'Audio': 'Nghe tư liệu', 'Infographic': 'Xem infographic', 'Tài liệu': 'Đọc tài liệu',
}

export default function LibraryGrid({ library, initialItemId }: { library: LibItem[]; initialItemId?: string }) {
  const [type, setType] = useState<LibType | 'Tất cả'>('Tất cả')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState<LibItem | null>(null)
  const catalog = prepareLibrary(library)
  const items = filterLibrary(catalog, type, search)
  const photos = items.filter(item => item.image)
  const documents = items.filter(item => !item.image && !item.media)
  const mediaItems = items.filter(item => item.media)
  const availableTypes = LIB_TYPES.filter(value => catalog.some(item => item.type === value))

  useEffect(() => {
    if (initialItemId) setPreview(prepareLibrary(library).find(item => item.id === initialItemId) ?? null)
  }, [initialItemId, library])

  function reset() { setType('Tất cả'); setSearch('') }

  return <>
    <div className="library-heading"><div><p className="eyebrow">Bộ sưu tập tư liệu</p><h2 id="library-title">Chọn điều bạn muốn khám phá.</h2></div><p>Đọc bài và xem ảnh ngay tại đây.<br />Mỗi tư liệu đều kèm nơi xuất bản hoặc hồ sơ ảnh.</p></div>
    <div className="library-tools">
      <label className="library-search" htmlFor="library-search">Tìm trong thư viện
        <div className="library-search-field"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input id="library-search" type="search" placeholder="Tên tư liệu, chủ đề hoặc nguồn…" value={search} onChange={event => setSearch(event.target.value)} aria-controls="library-results" /></div>
      </label>
      <div className="library-filters" role="group" aria-label="Loại tư liệu">
        {(['Tất cả', ...availableTypes] as const).map(value => <button key={value} type="button" className="library-filter" aria-pressed={type === value} aria-controls="library-results" onClick={() => setType(value)}>{value}<span>{value === 'Tất cả' ? catalog.length : catalog.filter(item => item.type === value).length}</span></button>)}
      </div>
    </div>
    <div className="library-result-summary"><p role="status" aria-live="polite" aria-atomic="true">{items.length} tư liệu{type !== 'Tất cả' ? ` · ${type}` : ''}{search.trim() ? ` · Tìm kiếm: “${search.trim()}”` : ''}</p>{(type !== 'Tất cả' || search) && <button type="button" onClick={reset}>Xóa bộ lọc ↺</button>}</div>
    <div id="library-results">
      {mediaItems.length > 0 && <div className="library-group"><h3 className="library-group-title">Ấn phẩm & đa phương tiện <span>{mediaItems.length}</span></h3><ul className="library-media-cards">
        {mediaItems.map(item => <li key={item.id} className={`library-media-card card-${item.media!.kind}`}>
          <button type="button" className="library-media-cover" onClick={() => setPreview(item)} aria-haspopup="dialog" aria-label={`${ACTIONS[item.type]}: ${item.title}`}>
            <LibraryCover item={item} />
          </button><div className="library-media-card-copy"><p className="library-type">{item.type} <span>· {item.media!.kind === 'book' ? 'Bản quét gốc' : item.media!.kind === 'book-guide' ? 'Bản đọc giới thiệu' : item.media!.kind === 'infographic' ? 'Trang biên soạn' : 'Phát từ nguồn gốc'}</span></p><h4><button className="library-title-button" type="button" aria-haspopup="dialog" onClick={() => setPreview(item)}>{item.title}</button></h4><p className="library-description">{item.description}</p><p className="library-source">{item.source}</p><button className="library-item-action" type="button" aria-haspopup="dialog" onClick={() => setPreview(item)}>{ACTIONS[item.type]} <span aria-hidden="true">→</span></button></div>
        </li>)}
      </ul></div>}
      {photos.length > 0 && <div className="library-group"><h3 className="library-group-title">Ảnh tư liệu <span>{photos.length}</span></h3><ul className="library-gallery">
        {photos.map(item => <li key={item.id} className="library-image-card">
          <button type="button" className="library-image-button" onClick={() => setPreview(item)} aria-label={`Phóng lớn: ${item.title}`} aria-haspopup="dialog"><Image src={item.image!.src} alt={item.image!.alt} width={item.image!.width} height={item.image!.height} sizes="(max-width: 700px) 88vw, (max-width: 1100px) 44vw, 28vw" /><span>Xem ảnh <i aria-hidden="true">↗</i></span></button>
          <div className="library-image-copy"><h4>{item.title}</h4><p><a href={item.url} target="_blank" rel="noopener noreferrer">{item.image!.shortCredit || item.image!.credit}</a></p></div>
        </li>)}
      </ul></div>}
      {documents.length > 0 && <div className="library-group"><h3 className="library-group-title">Tư liệu đọc, xem & nghe <span>{documents.length}</span></h3><ul className="library-documents">
        {documents.map(item => <li key={item.id} className="library-document"><span className="library-document-icon" aria-hidden="true"><svg viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 2h15l7 7v29H5zM20 2v8h7M10 17h12M10 23h12M10 29h8" /></svg></span><div><span className="library-type">{item.type}</span><h4><button type="button" className="library-title-button" onClick={() => setPreview(item)} aria-haspopup="dialog">{item.title}</button></h4>{item.description && <p className="library-description">{item.description}</p>}<p className="library-source">{item.source}</p>{item.type === 'Audio' && /\.(mp3|wav|ogg|m4a|aac)(?:[?#]|$)/i.test(item.url) && <audio controls preload="none" src={item.url} aria-label={`Nghe ${item.title}`} />}<button type="button" className="library-item-action" onClick={() => setPreview(item)} aria-haspopup="dialog">{ACTIONS[item.type]} <span aria-hidden="true">↗</span></button></div></li>)}
      </ul></div>}
      {!items.length && <div className="library-empty"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg><h3>{search.trim() ? 'Chưa tìm thấy tư liệu phù hợp.' : `Chưa có tư liệu ${type.toLocaleLowerCase('vi')}.`}</h3><p>{search.trim() ? 'Thử một từ khóa ngắn hơn, tìm theo tên nguồn hoặc chọn một loại tư liệu khác. Bạn có thể tìm bằng tiếng Việt có dấu hoặc không dấu.' : 'Bạn có thể khám phá ảnh và các bài đọc đang có trong thư viện.'}</p><button type="button" className="btn dark" onClick={reset}>Xem tất cả tư liệu <span aria-hidden="true">→</span></button></div>}
    </div>
    <ReadingDialog preview={preview} onDismiss={() => setPreview(null)} />
  </>
}
