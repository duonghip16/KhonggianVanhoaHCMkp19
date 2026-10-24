import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../lib/editorial.ts', import.meta.url), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { editorialErrors, safeUrl } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
const contributionsSource = ts.transpileModule(await readFile(new URL('../lib/contributions.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText.replace("'./editorial'", JSON.stringify(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`))
const { validateContribution } = await import(`data:text/javascript;base64,${Buffer.from(contributionsSource).toString('base64')}`)
test('contribution validation rejects injected fields, missing consent, invalid dates and excessive text', () => {
  const data = { type: 'deeds', text: ' Một việc tốt ', name: '', consent: true }
  assert.equal(validateContribution(data).text, 'Một việc tốt')
  for (const invalid of [{ ...data, status: 'published' }, { ...data, verifiedBy: 'forged' }, { ...data, consent: false }, { ...data, type: 'stories' }, { ...data, date: '2026-02-30' }, { ...data, text: 'x'.repeat(401) }, { ...data, name: null }]) assert.equal(validateContribution(invalid), null)
})
const record = { status: 'draft', title: 'Tiêu đề', text: '', name: '', category: '', source: '', verifiedBy: '', verifiedOn: '', date: '', url: '', photographer: '', permission: '', period: '', value: 0, type: 'Tài liệu' }
test('draft is editable without invented evidence', () => assert.deepEqual(editorialErrors('stories', record), []))
test('verified and published require evidence', () => {
  for (const status of ['verified', 'published']) assert.ok(editorialErrors('stories', { ...record, status, text: 'Nội dung', date: '2026-10-07' }).length)
})
test('statistics require a reporting period and non-negative value', () => {
  const verified = { ...record, status: 'published', source: 'Báo cáo', verifiedBy: 'Người xác minh', verifiedOn: '2026-10-07' }
  assert.ok(editorialErrors('site_stats', verified).length)
  assert.ok(editorialErrors('site_stats', { ...verified, period: '2026', value: -1 }).length)
  assert.deepEqual(editorialErrors('site_stats', { ...verified, period: '2026', value: 0 }), [])
})
test('photos require permission and provenance', () => {
  const media = { ...record, status: 'published', source: 'Tư liệu', verifiedBy: 'Người xác minh', verifiedOn: '2026-10-07', date: '2026-10-06', category: 'hero', url: '/images/anh.webp', photographer: 'Người chụp' }
  assert.ok(editorialErrors('media', media).length)
  assert.deepEqual(editorialErrors('media', { ...media, permission: 'Có văn bản đồng ý đăng' }), [])
})
test('unsafe URLs and long submissions are rejected', () => {
  for (const url of ['javascript:alert(1)', '//example.com/image', 'http://example.com', '/\\example.com/image', '/\n/example.com/image', 'https://name:secret@example.com/image']) assert.equal(safeUrl(url), false)
  assert.equal(safeUrl('https://example.com/image'), true)
  assert.ok(editorialErrors('deeds', { ...record, text: 'x'.repeat(401) }).length)
})
test('quiz drafts can be incomplete; published questions require valid answers', () => {
  assert.deepEqual(editorialErrors('quiz_questions', record), [])
  const question = { ...record, status: 'published', source: 'Nguồn', verifiedBy: 'Người kiểm tra', verifiedOn: '2026-10-07', options: 'Một\nHai', correct: 1, text: 'Giải thích' }
  assert.deepEqual(editorialErrors('quiz_questions', question), [])
  assert.ok(editorialErrors('quiz_questions', { ...question, correct: 2 }).length)
  assert.ok(editorialErrors('quiz_questions', { ...question, options: 'Một' }).length)
})
test('invalid calendar dates cannot be verified', () => {
  const story = { ...record, status: 'verified', text: 'Nội dung', date: '2026-02-30', source: 'Nguồn', verifiedBy: 'Người xác minh', verifiedOn: '2026-10-07' }
  assert.ok(editorialErrors('stories', story).length)
  assert.deepEqual(editorialErrors('stories', { ...story, date: '2026-02-28' }), [])
})
