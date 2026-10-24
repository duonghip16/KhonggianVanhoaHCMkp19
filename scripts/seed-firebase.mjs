import { readFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'
import { firebaseProject, firebaseSession } from './firebase-session.mjs'

const modules = new Map()
async function moduleUrl(filename) {
  filename = path.resolve(filename)
  if (modules.has(filename)) return modules.get(filename)
  let output = ts.transpileModule(await readFile(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const imports = [...output.matchAll(/from\s+['"]([^'"]+)['"]/g)]
  for (const [, specifier] of imports) {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) throw new Error('Bộ tư liệu có dependency không được hỗ trợ.')
    const dependency = specifier.startsWith('@/') ? path.resolve(specifier.slice(2) + '.ts') : path.resolve(path.dirname(filename), specifier + '.ts')
    const url = await moduleUrl(dependency)
    output = output.replaceAll(`'${specifier}'`, JSON.stringify(url)).replaceAll(`"${specifier}"`, JSON.stringify(url))
  }
  const url = `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`
  modules.set(filename, url)
  return url
}

const encodeFields = data => Object.fromEntries(Object.entries(data).map(([key, value]) => {
  if (typeof value === 'string') return [key, { stringValue: value }]
  if (typeof value === 'number' && Number.isFinite(value)) return [key, Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }]
  throw new Error('Trường dữ liệu không được hỗ trợ.')
}))

try {
  const project = firebaseProject()
  const { starterContent } = await import(await moduleUrl('lib/seed-content.ts'))
  const { editorialErrors } = await import(await moduleUrl('lib/editorial.ts'))
  const entries = starterContent()
  if (entries.some(entry => entry.record.status !== 'draft' || editorialErrors(entry.collection, entry.record).length)) throw new Error('Bộ tư liệu chưa hợp lệ; chỉ cho phép nhập bản nháp.')
  const { accessToken, operator } = await firebaseSession()
  const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents`
  const request = async (url, init = {}) => fetch(url, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(20000) })
  const missing = []
  for (let offset = 0; offset < entries.length; offset += 8) {
    const group = entries.slice(offset, offset + 8)
    const responses = await Promise.all(group.map(entry => request(`${base}/${entry.collection}/${entry.id}`)))
    responses.forEach((response, index) => {
      if (response.status === 404) missing.push(group[index])
      else if (!response.ok) throw new Error(`Chưa đọc được database: HTTP ${response.status}. Kiểm tra quyền IAM của tài khoản đăng nhập.`)
    })
  }
  console.log(`Project: ${project}; có sẵn ${entries.length - missing.length}/${entries.length} bản; cần nhập ${missing.length} bản nháp.`)
  if (process.argv.includes('--dry-run')) console.log('Chỉ kiểm tra; chưa ghi dữ liệu.')
  else if (!missing.length) console.log('Không có bản mới; giữ nguyên toàn bộ dữ liệu đã có.')
  else {
    const writes = missing.map(entry => ({
      update: { name: `projects/${project}/databases/(default)/documents/${entry.collection}/${entry.id}`, fields: encodeFields({ ...entry.record, updatedBy: operator }) },
      currentDocument: { exists: false },
      updateTransforms: ['createdAt', 'updatedAt'].map(fieldPath => ({ fieldPath, setToServerValue: 'REQUEST_TIME' })),
    }))
    const response = await request(`${base}:commit`, { method: 'POST', body: JSON.stringify({ writes }) })
    if (!response.ok) throw new Error(`Chưa nhập được dữ liệu: HTTP ${response.status}. Giao dịch không ghi đè; nếu có bản vừa được tạo, chạy lại lệnh.`)
    const result = await response.json()
    if (result.writeResults?.length !== writes.length) throw new Error('Chưa xác nhận được đầy đủ kết quả ghi. Chạy lại chế độ --dry-run để kiểm tra.')
    console.log(`Đã nhập ${writes.length} bản nháp lên Firestore, giữ nguyên ${entries.length - writes.length} bản đã có. Chưa tự xuất bản nội dung.`)
  }
} catch (error) {
  // Do not print token-bearing request details or stack traces from authentication internals.
  console.error(error instanceof Error && !/token|https?:\/\//i.test(error.message) ? error.message : 'Không hoàn tất được nhập dữ liệu. Kiểm tra phiên Firebase CLI và quyền project.')
  process.exitCode = 1
}
