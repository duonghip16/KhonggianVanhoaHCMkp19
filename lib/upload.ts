import { firebaseAuth } from './firebase'
export async function uploadMedia(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('Chỉ nhận JPG, PNG, WebP hoặc AVIF.')
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Chọn ảnh có dung lượng tối đa 5 MB.')
  const user = firebaseAuth()?.currentUser
  if (!user) throw new Error('Vui lòng đăng nhập quản trị để tải ảnh.')
  const token = await user.getIdToken()
  const form = new FormData()
  form.set('file', file)
  let response: Response
  try {
    response = await fetch('/api/media/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form, signal: AbortSignal.timeout(60_000) })
  } catch { throw new Error('Kết nối bị gián đoạn. Vui lòng thử tải ảnh lại.') }
  let data: { error?: string; url?: unknown }
  try { data = await response.json() } catch { throw new Error('Máy chủ chưa trả kết quả tải ảnh. Vui lòng thử lại.') }
  if (!response.ok) throw new Error(data.error || 'Chưa tải được ảnh. Vui lòng thử lại.')
  if (typeof data.url !== 'string' || !data.url.startsWith('https://')) throw new Error('Chưa nhận được đường dẫn ảnh hợp lệ.')
  return data.url as string
}
