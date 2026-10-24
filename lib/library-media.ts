import type { LibraryMedia } from '@/data/library-multimedia'
import type { EditorialRecord } from './editorial'
import { safeUrl } from './editorial'

export function libraryMedia(record: EditorialRecord): LibraryMedia | undefined {
  if (!safeUrl(record.url)) return
  const credit = [record.source, record.photographer && `Ảnh: ${record.photographer}`, record.permission && `Quyền sử dụng: ${record.permission}`].filter(Boolean).join(' · ')
  if (['Hình ảnh', 'Infographic'].includes(record.type) && /\.(png|jpe?g|webp|avif|gif|svg)(?:[?#]|$)/i.test(record.url)) return { kind: 'image', src: record.url, alt: record.title, credit }
  if (record.type === 'Audio' && /\.(mp3|wav|ogg|m4a|aac)(?:[?#]|$)/i.test(record.url)) return { kind: 'audio', src: record.url, credit }
  if (record.type === 'Video') {
    if (/\.(mp4|webm|ogv)(?:[?#]|$)/i.test(record.url)) return { kind: 'video', src: record.url, credit }
    try {
      const url = new URL(record.url)
      const host = url.hostname.toLowerCase()
      const id = host === 'youtu.be' ? url.pathname.slice(1) : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host) ? url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts)\/([\w-]{11})$/.exec(url.pathname)?.[2] : null
      if (id && /^[\w-]{11}$/.test(id)) return { kind: 'video', src: `https://www.youtube-nocookie.com/embed/${id}`, credit, provider: 'youtube' }
    } catch { /* Local URLs do not have a YouTube host. */ }
  }
  if (['Sách', 'Tài liệu'].includes(record.type) && /\.pdf(?:[?#]|$)/i.test(record.url)) return { kind: 'pdf', src: record.url, credit }
}
