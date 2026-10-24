import { type EditorialRecord, type ManagedCollection } from './editorial'
import { normalizeLibrarySearch } from './library'

export const ADMIN_SECTIONS: { id: ManagedCollection; slug: string; label: string; description: string; icon: string }[] = [
  { id: 'stories', slug: 'cau-chuyen', label: 'Câu chuyện', description: 'Biên tập những câu chuyện có thật, có nguồn và sự đồng ý công bố.', icon: 'book' },
  { id: 'activities', slug: 'hoat-dong', label: 'Hoạt động', description: 'Quản lý hành trình hoạt động, ngày diễn ra và nhóm giá trị.', icon: 'calendar' },
  { id: 'library', slug: 'thu-vien', label: 'Thư viện số', description: 'Sách, bài đọc, ảnh, video, audio và infographic có nguồn rõ ràng.', icon: 'library' },
  { id: 'deeds', slug: 'viec-tot', label: 'Việc tốt', description: 'Đọc bài gửi từ cộng đồng, xác minh và duyệt từng việc tốt.', icon: 'heart' },
  { id: 'messages', slug: 'loi-nhan', label: 'Lời nhắn', description: 'Xét duyệt lời nhắn và bảo vệ thông tin riêng tư của người gửi.', icon: 'message' },
  { id: 'site_stats', slug: 'thong-ke', label: 'Số liệu', description: 'Chỉ nhập số liệu đã được xác minh, có kỳ báo cáo và căn cứ.', icon: 'chart' },
  { id: 'media', slug: 'hinh-anh', label: 'Kho ảnh', description: 'Ảnh trên ImageKit, URL trong Firestore và hồ sơ quyền sử dụng.', icon: 'image' },
  { id: 'quiz_questions', slug: 'quiz', label: 'Câu hỏi quiz', description: 'Câu hỏi tình huống, đáp án và phần giải thích có căn cứ.', icon: 'quiz' },
  { id: 'daily_challenges', slug: 'thu-thach', label: 'Thử thách', description: 'Những việc vừa sức, gắn với giá trị thực hành mỗi ngày.', icon: 'spark' },
]
export function blankRecord(): EditorialRecord {
  return { status: 'draft', title: '', text: '', name: '', category: '', source: '', verifiedBy: '', verifiedOn: '', date: '', url: '', photographer: '', permission: '', period: '', value: 0, type: 'Tài liệu', options: '', correct: 0 }
}
export function adminRecords(records: EditorialRecord[], status: string, search: string, sort: string) {
  const terms = normalizeLibrarySearch(search).split(/\s+/).filter(Boolean)
  return records.filter(item => (status === 'all' || item.status === status) && terms.every(term => normalizeLibrarySearch(`${item.id || ''} ${item.title} ${item.text} ${item.source} ${item.name} ${item.category}`).includes(term))).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title, 'vi') : recordTime(b) - recordTime(a) || (b.id || '').localeCompare(a.id || ''))
}
export function recordTime(record: EditorialRecord) {
  return record.createdAt?.seconds ? record.createdAt.seconds * 1000 + record.createdAt.nanoseconds / 1e6 : Date.parse(record.date || record.verifiedOn) || 0
}
export function recordRevision(record: EditorialRecord) {
  const keys = [...Object.keys(blankRecord()), 'consent', 'createdAt', 'updatedAt', 'curatedId'].sort()
  return JSON.stringify(keys.map(key => {
    const value = record[key as keyof EditorialRecord]
    return value && typeof value === 'object' && 'seconds' in value ? [key, value.seconds, value.nanoseconds] : [key, value ?? null]
  }))
}
export function csvCell(value: unknown) {
  const text = String(value ?? '')
  const safe = /^[=+\-@\t\r\n]/.test(text.trimStart()) || /^[\t\r\n]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}
