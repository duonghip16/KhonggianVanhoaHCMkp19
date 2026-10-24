import { readFileSync, existsSync } from 'node:fs'

// This command performs read-only queries. It never prints keys or credentials.
const env = { ...process.env }
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (match && env[match[1]] === undefined) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
}
const required = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'APP_ID']
const missing = required.filter(key => !env[`NEXT_PUBLIC_FIREBASE_${key}`])
if (missing.length) {
  console.error(`Thiếu cấu hình: ${missing.map(key => `NEXT_PUBLIC_FIREBASE_${key}`).join(', ')}`)
  process.exitCode = 1
} else {
  const project = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  console.log(`Kiểm tra Firestore project: ${project}`)
  for (const collection of ['library', 'stories', 'activities', 'media', 'site_stats', 'quiz_questions', 'daily_challenges', 'deeds', 'messages']) {
    try {
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } } }, limit: 1 } }),
      })
      const result = await response.json()
      const error = Array.isArray(result) ? result.find(item => item.error)?.error : result.error
      if (!response.ok || error) {
        const reason = error?.details?.find(item => item.reason)?.reason
        if (reason === 'SERVICE_DISABLED') console.error('Firestore API chưa bật. Mở Firebase Console → Firestore Database và tạo database (default).')
        else if (error?.status === 'NOT_FOUND') console.error('Chưa tìm thấy Firestore database (default).')
        else console.error(`Chưa đọc được ${collection}: ${error?.status ?? `HTTP ${response.status}`}. Kiểm tra Firestore Rules và cấu hình database.`)
        process.exitCode = 1
        break
      }
      if (!Array.isArray(result)) throw new Error('Unexpected response')
      console.log(`${collection}: đọc công khai thành công; ${result.some(item => item.document) ? 'có nội dung xuất bản' : 'chưa có nội dung xuất bản'}.`)
    } catch {
      console.error('Chưa kiểm tra được kết nối. Kiểm tra mạng rồi chạy lại.')
      process.exitCode = 1
      break
    }
  }
}
