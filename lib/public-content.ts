import 'server-only'
import { cache } from 'react'
import { COLLECTIONS, type EditorialRecord, type ManagedCollection, editorialErrors } from './editorial'
import { decodeFirestoreFields, type FirestoreValue } from './firestore-values'
// Unauthenticated requests keep server rendering subject to public read rules.
export const publishedRecords = cache(async (col: ManagedCollection): Promise<EditorialRecord[]> => {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!project || !COLLECTIONS.includes(col)) return []
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: col }], where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } } }, limit: 100 } }),
    })
    if (!response.ok) { console.error(`Public content ${col}: HTTP ${response.status}`); throw new Error('Content unavailable') }
    const results = await response.json() as { document?: { name: string; fields: Record<string, FirestoreValue> } }[]
    if (!Array.isArray(results) || results.some(result => 'error' in result)) throw new Error('Content unavailable')
    return results.flatMap(({ document }) => {
      if (!document) return []
      const data = decodeFirestoreFields(document.fields)
      if (data.status !== 'published') return []
      if (['title', 'text', 'name', 'category', 'source', 'verifiedBy', 'verifiedOn', 'date', 'url', 'photographer', 'permission', 'period', 'type', 'options', 'curatedId'].some(key => key in data && typeof data[key] !== 'string')) return []
      const record = { title: '', text: '', name: '', category: '', source: '', verifiedBy: '', verifiedOn: '', date: '', url: '', photographer: '', permission: '', period: '', value: 0, type: '', ...data, id: document.name.split('/').pop() } as EditorialRecord
      if (col === 'deeds' || col === 'messages') return record.consent === true && record.text.trim() && record.text.length <= 400 && record.name.length <= 60 ? [record] : []
      return editorialErrors(col, record).length ? [] : [record]
    }).sort((a, b) => b.verifiedOn.localeCompare(a.verifiedOn) || (b.id || '').localeCompare(a.id || ''))
  } catch { console.error(`Public content ${col}: unavailable`); throw new Error('Chưa tải được nội dung. Vui lòng thử lại sau.') }
})

// Keep the exhibition available without presenting a service failure as an empty database.
export async function loadPublishedCollections<T extends readonly ManagedCollection[]>(collections: T) {
  const results = await Promise.allSettled(collections.map(col => publishedRecords(col)))
  return {
    records: results.map(result => result.status === 'fulfilled' ? result.value : []),
    unavailable: results.some(result => result.status === 'rejected'),
  }
}
