import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const editorial = url(compile(await readFile(new URL('../lib/editorial.ts', import.meta.url), 'utf8')))
const library = url(compile(await readFile(new URL('../lib/library.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorial)))
const { ADMIN_SECTIONS, adminRecords, blankRecord, csvCell, recordRevision } = await import(url(compile(await readFile(new URL('../lib/admin.ts', import.meta.url), 'utf8')).replace("'./library'", JSON.stringify(library))))
test('admin navigation covers each managed collection exactly once', () => {
  assert.equal(ADMIN_SECTIONS.length, 9)
  assert.equal(new Set(ADMIN_SECTIONS.map(item => item.id)).size, 9)
  assert.equal(new Set(ADMIN_SECTIONS.map(item => item.slug)).size, 9)
  assert.equal(blankRecord().status, 'draft')
  assert.equal(blankRecord().verifiedBy, '')
})
test('admin filters use all terms, Vietnamese normalization, source and status without mutating records', () => {
  const records = [{ ...blankRecord(), id: 'a', title: 'Tiểu sử Bác', source: 'Bảo tàng', date: '2026-10-07' }, { ...blankRecord(), id: 'b', title: 'Câu chuyện', status: 'published', date: '2026-10-08' }]
  assert.deepEqual(adminRecords(records, 'draft', 'tieu bao tang', 'recent').map(item => item.id), ['a'])
  assert.deepEqual(adminRecords(records, 'all', '', 'recent').map(item => item.id), ['b', 'a'])
  assert.deepEqual(records.map(item => item.id), ['a', 'b'])
})
test('CSV export preserves quotes and blocks spreadsheet formulas from submissions', () => {
  assert.equal(csvCell('Một "lời" nhắn'), '"Một ""lời"" nhắn"')
  for (const text of ['=1+1', '+1', '-1', '@SUM(A1)', '  =HYPERLINK("url")', '\t=1']) assert.ok(csvCell(text).startsWith('"\''))
  assert.equal(csvCell(12), '"12"')
})

test('new submissions without event dates are sorted by receipt time and searchable by ID', () => {
  const records = [{ ...blankRecord(), id: 'z-old', createdAt: { seconds: 100, nanoseconds: 0 } }, { ...blankRecord(), id: 'a-new', createdAt: { seconds: 101, nanoseconds: 0 } }]
  assert.deepEqual(adminRecords(records, 'all', '', 'recent').map(item => item.id), ['a-new', 'z-old'])
  assert.deepEqual(adminRecords(records, 'all', 'a-new', 'recent').map(item => item.id), ['a-new'])
})

test('edit conflict fingerprint catches content, consent and timestamp changes across serialization', () => {
  const original = { ...blankRecord(), title: 'Bản gốc', consent: true, updatedAt: { seconds: 100, nanoseconds: 5 } }
  assert.equal(recordRevision(original), recordRevision(JSON.parse(JSON.stringify(original))))
  for (const patch of [{ title: 'Đã sửa' }, { consent: false }, { updatedAt: { seconds: 100, nanoseconds: 6 } }]) assert.notEqual(recordRevision(original), recordRevision({ ...original, ...patch }))
})

test('moderation requires explicit consent and evidence before publishing', async () => {
  const { editorialErrors } = await import(editorial)
  const item = { ...blankRecord(), status: 'published', title: 'Lời nhắn', text: 'Nội dung', source: 'Bài gửi', verifiedBy: 'Người duyệt', verifiedOn: '2026-10-24' }
  for (const collection of ['deeds', 'messages']) {
    assert.ok(editorialErrors(collection, item).some(error => error.includes('đồng ý')))
    assert.deepEqual(editorialErrors(collection, { ...item, consent: true }), [])
  }
})
