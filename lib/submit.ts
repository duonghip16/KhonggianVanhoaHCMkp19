import { validDate } from './editorial'
export type Col = 'deeds' | 'messages'
export type PublishedContribution = { id: string; title: string; date: string; text: string; name: string }
/** Gửi nội dung ở trạng thái "pending". Trả 'local' nếu chưa cấu hình Firebase. */
export async function submit(col: Col, data: { text: string; name: string; title?: string; date?: string }): Promise<'saved' | 'local' | 'limited' | 'error'> {
  if (!data.text.trim() || data.text.length > 400 || data.name.length > 60) return 'error'
  if (data.title !== undefined && (!data.title.trim() || data.title.length > 200)) return 'error'
  if (data.date !== undefined && !validDate(data.date)) return 'error'
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_APP_ID || !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) return 'local'
  try {
    const response = await fetch('/api/contributions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: col, consent: true }), signal: AbortSignal.timeout(12000),
    })
    if (response.status === 429) return 'limited'
    if (!response.ok) return 'error'
    const result = await response.json()
    return result.saved === true ? 'saved' : 'error'
  } catch { return 'error' }
}
/** Chỉ đọc nội dung đã được quản trị viên đặt status = "published". */
export async function fetchPublished(col: Col): Promise<PublishedContribution[] | null> {
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return []
    const response = await fetch(`/api/community?type=${col}`, { signal: AbortSignal.timeout(10000) })
    if (!response.ok) return null
    return await response.json() as PublishedContribution[]
  } catch { return null }
}
