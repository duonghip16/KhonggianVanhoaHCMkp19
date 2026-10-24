import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { firebaseProject, firebaseSession } from './firebase-session.mjs'

const source = await readFile(new URL('../data/home-media.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { HOME_MEDIA } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const project = firebaseProject(), { accessToken } = await firebaseSession()
const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents`
const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
const response = await fetch(`${endpoint}:runQuery`, { method: 'POST', headers, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'media' }] } }) })
const existing = await response.json()
if (!response.ok || !Array.isArray(existing) || existing.some(item => item.error)) throw new Error('Không đọc được danh mục media.')
for (const item of HOME_MEDIA) {
  if (existing.some(record => record.document?.fields?.category?.stringValue === item.slot)) { console.log(`${item.slot}: đã có, giữ nguyên.`); continue }
  if (!process.argv.includes('--apply')) { console.log(`${item.slot}: sẽ tạo bản nháp.`); continue }
  const values = { title: item.caption, text: '', name: '', status: 'draft', category: item.slot, url: item.src, source: 'Hình ảnh hoạt động của Khu phố 19.', verifiedBy: '', verifiedOn: '', date: '', photographer: '', permission: '', period: '', type: '' }
  const fields = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { stringValue: value }]))
  const saved = await fetch(`${endpoint}/media?documentId=${encodeURIComponent(`home-${item.slot}`)}`, { method: 'POST', headers, body: JSON.stringify({ fields }) })
  if (!saved.ok) throw new Error(`Không tạo được bản nháp ${item.slot}: HTTP ${saved.status}`)
  console.log(`${item.slot}: đã tạo bản nháp, ảnh dự phòng tiếp tục hiển thị.`)
}
