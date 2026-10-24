export const EDITORIAL_STATUS = ['draft', 'pending', 'verified', 'published'] as const
export type EditorialStatus = typeof EDITORIAL_STATUS[number]
export const EDITORIAL_LABEL: Record<EditorialStatus, string> = {
  draft: 'Nháp', pending: 'Chờ xác minh', verified: 'Đã xác minh', published: 'Đã xuất bản',
}
export const COLLECTIONS = ['stories', 'activities', 'library', 'deeds', 'messages', 'site_stats', 'media', 'quiz_questions', 'daily_challenges'] as const
export type ManagedCollection = typeof COLLECTIONS[number]
export type EditorialRecord = {
  id?: string; status: EditorialStatus; title: string; text: string; name: string;
  category: string; source: string; verifiedBy: string; verifiedOn: string;
  date: string; url: string; photographer: string; permission: string;
  period: string; value: number; type: string;
  options?: string; correct?: number; curatedId?: string;
  consent?: boolean;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  try { return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value } catch { return false }
}
export function quizOptions(value: string) { return value.split('\n').map(item => item.trim()).filter(Boolean) }
export function safeUrl(value: string) {
  if (/[\u0000-\u0020\\]/.test(value)) return false
  if (/^\/(?!\/)/.test(value)) return true
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
export function editorialErrors(col: ManagedCollection, record: EditorialRecord): string[] {
  const errors: string[] = []
  if (!EDITORIAL_STATUS.includes(record.status)) errors.push('Trạng thái không hợp lệ.')
  if (!record.title.trim() || record.title.length > 200) errors.push('Tiêu đề cần từ 1 đến 200 ký tự.')
  if (record.text.length > 20000 || record.name.length > 60) errors.push('Nội dung hoặc tên quá dài.')
  if ((col === 'deeds' || col === 'messages') && (!record.text.trim() || record.text.length > 400)) errors.push('Bài gửi cần từ 1 đến 400 ký tự.')
  if (record.url && !safeUrl(record.url)) errors.push('Đường dẫn phải là HTTPS hoặc đường dẫn ảnh trong website.')
  if (col === 'site_stats' && (!Number.isFinite(record.value) || record.value < 0)) errors.push('Số liệu phải là số không âm.')
  if (col === 'quiz_questions' && (record.status === 'verified' || record.status === 'published')) {
    const options = quizOptions(record.options || '')
    if (options.length < 2 || options.length > 4 || !Number.isInteger(record.correct) || record.correct! < 0 || record.correct! >= options.length || !record.text.trim()) errors.push('Quiz cần 2–4 đáp án, một đáp án đúng và phần giải thích.')
  }
  if (record.status === 'verified' || record.status === 'published') {
    if ((col === 'deeds' || col === 'messages') && record.consent !== true) errors.push('Cần sự đồng ý công khai của người gửi trước khi xác minh hoặc xuất bản.')
    if (!record.source.trim() || !record.verifiedBy.trim() || !validDate(record.verifiedOn)) errors.push('Cần nguồn, người xác minh và ngày xác minh hợp lệ.')
    if (col === 'site_stats' && !record.period.trim()) errors.push('Cần kỳ báo cáo cho số liệu.')
    if (col === 'media' && (!record.url || !validDate(record.date) || !record.category || !record.photographer.trim() || !record.permission.trim())) errors.push('Ảnh cần vị trí, đường dẫn, ngày chụp hợp lệ, người chụp và căn cứ quyền đăng.')
    if (col === 'stories' && (!record.text.trim() || !validDate(record.date))) errors.push('Câu chuyện cần nội dung và ngày sự kiện hợp lệ.')
    if (col === 'activities' && (!record.text.trim() || !validDate(record.date) || !record.category.trim())) errors.push('Hoạt động cần mô tả, ngày hợp lệ và chủ đề.')
    if (col === 'daily_challenges' && (!record.text.trim() || !record.category.trim())) errors.push('Thử thách cần hành động và nhóm giá trị.')
    if (col === 'library' && !record.url) errors.push('Tư liệu cần đường dẫn.')
  }
  return errors
}
