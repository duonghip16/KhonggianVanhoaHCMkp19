import { LIBRARY, LIB_TYPES, type LibItem, type LibType } from '@/data/content'
import type { EditorialRecord } from './editorial'
import { libraryMedia } from './library-media'

export function managedLibraryItem(record: EditorialRecord): LibItem | null {
  if (!record.id || record.status !== 'published' || !LIB_TYPES.includes(record.type as LibType)) return null
  const curated = LIBRARY.find(item => item.id === record.curatedId && item.url === record.url && item.type === record.type)
    ?? LIBRARY.find(item => item.url === record.url && item.type === record.type)
  return {
    ...curated, media: curated?.media ?? (curated?.image ? undefined : libraryMedia(record)), id: curated?.id ?? `cms:${record.id}`, title: record.title,
    description: record.text, type: record.type as LibType,
    source: record.source, url: record.url, status: 'published',
  }
}
