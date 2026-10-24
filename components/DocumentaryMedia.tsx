import Image from 'next/image'
import type { EditorialRecord } from '@/lib/editorial'
export default function DocumentaryMedia({ item, placeholder = 'Ảnh thực tế Khu phố 19 đang chờ tư liệu', priority = false }: { item?: EditorialRecord; placeholder?: string; priority?: boolean }) {
  if (!item) return <div className="ph tall"><div>{placeholder}</div></div>
  return <figure className="documentary"><div className="documentary-image"><Image src={item.url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} unoptimized={!item.url.startsWith('/')} /></div><figcaption>{item.title}<br />{item.photographer}</figcaption></figure>
}
