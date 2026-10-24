const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }
type UploadConfig = { privateKey?: string; urlEndpoint?: string }
const reply = (status: number, error: string) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

function matchesImage(bytes: Buffer, type: string) {
  if (type === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  if (type === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (type === 'image/webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
  if (type === 'image/avif') {
    const boxSize = bytes.readUInt32BE(0)
    if (bytes.toString('ascii', 4, 8) !== 'ftyp' || boxSize < 16 || boxSize > bytes.length) return false
    for (let offset = 8; offset + 4 <= boxSize; offset += 4) {
      if (offset !== 12 && ['avif', 'avis'].includes(bytes.toString('ascii', offset, offset + 4))) return true
    }
  }
  return false
}

export async function handleMediaUpload(request: Request, verifyAdmin: (token: string) => Promise<boolean>, config: UploadConfig) {
  const authorization = request.headers.get('authorization') || ''
  const token = /^Bearer ([^\s]+)$/.exec(authorization)?.[1]
  if (!token) return reply(401, 'Vui lòng đăng nhập quản trị để tải ảnh.')
  try {
    if (!await verifyAdmin(token)) return reply(403, 'Tài khoản không có quyền tải ảnh.')
  } catch { return reply(401, 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.') }
  if (!config.privateKey || !config.urlEndpoint) return reply(503, 'Chưa cấu hình ImageKit trên máy chủ.')
  let endpoint: URL
  try {
    endpoint = new URL(config.urlEndpoint)
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error()
  } catch { return reply(503, 'Cấu hình ImageKit chưa hợp lệ.') }
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) return reply(400, 'Cần gửi tệp ảnh.')
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_SIZE) return reply(413, 'Ảnh cần nhỏ hơn hoặc bằng 5 MB.')
  let file: File
  try {
    const reader = request.body?.getReader()
    if (!reader) return reply(400, 'Cần chọn ảnh để tải lên.')
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      length += chunk.value.byteLength
      if (length > MAX_REQUEST_SIZE) { await reader.cancel(); return reply(413, 'Ảnh cần nhỏ hơn hoặc bằng 5 MB.') }
      chunks.push(chunk.value)
    }
    const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type')! } }).formData()
    const entry = form.get('file')
    if (!entry || typeof entry === 'string' || !entry.size) return reply(400, 'Cần chọn ảnh để tải lên.')
    file = entry
  } catch { return reply(400, 'Tệp tải lên chưa hợp lệ.') }
  if (file.size > MAX_FILE_SIZE) return reply(413, 'Ảnh cần nhỏ hơn hoặc bằng 5 MB.')
  if (!EXTENSIONS[file.type]) return reply(415, 'Chỉ nhận JPG, PNG, WebP hoặc AVIF.')
  const bytes = Buffer.from(await file.arrayBuffer())
  if (bytes.length < 16 || !matchesImage(bytes, file.type)) return reply(415, 'Nội dung tệp không khớp định dạng ảnh.')
  const upload = new FormData()
  upload.set('file', file)
  upload.set('fileName', `${crypto.randomUUID()}.${EXTENSIONS[file.type]}`)
  upload.set('folder', '/kp19/editorial')
  upload.set('useUniqueFileName', 'true')
  try {
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${config.privateKey}:`).toString('base64')}` },
      body: upload, signal: AbortSignal.timeout(45_000), cache: 'no-store', redirect: 'error',
    })
    if (!response.ok) return reply(502, 'ImageKit chưa nhận được ảnh. Vui lòng thử lại.')
    const data = await response.json()
    if (typeof data.url !== 'string' || typeof data.fileId !== 'string' || !data.fileId) throw new Error()
    const url = new URL(data.url)
    const prefix = `${endpoint.pathname.replace(/\/$/, '')}/`
    if (url.origin !== endpoint.origin || !url.pathname.startsWith(prefix) || url.username || url.password) throw new Error()
    return Response.json({ url: url.href }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch { return reply(502, 'Chưa tải được ảnh lên ImageKit. Vui lòng thử lại.') }
}
