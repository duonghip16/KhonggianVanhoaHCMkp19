import type { LibItem, LibType } from '@/data/content'
import { safeUrl } from './editorial'

export function normalizeLibrarySearch(value: string) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim()
}

export function prepareLibrary(library: LibItem[]) {
  const ids = new Set<string>(), urls = new Set<string>()
  return library.filter(item => {
    const sourceFormat = `${item.type}:${item.url}`
    if (item.status !== 'published' || !safeUrl(item.url) || ids.has(item.id) || urls.has(sourceFormat)) return false
    ids.add(item.id); urls.add(sourceFormat)
    return true
  })
}

export function filterLibrary(library: LibItem[], type: LibType | 'Tất cả', query: string) {
  const terms = normalizeLibrarySearch(query).split(/\s+/).filter(Boolean)
  return library.filter(item => {
    if (type !== 'Tất cả' && item.type !== type) return false
    const text = normalizeLibrarySearch(`${item.title} ${item.source} ${item.description || ''} ${item.image?.credit || ''}`)
    return terms.every(term => text.includes(term))
  })
}
