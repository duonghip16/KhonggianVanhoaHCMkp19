import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const editorial = moduleUrl(compile(await readFile(new URL('../lib/editorial.ts', import.meta.url), 'utf8')))
const contributions = moduleUrl(compile(await readFile(new URL('../lib/contributions.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorial)))
const response = moduleUrl('export const NextResponse = {json: (data, init) => new Response(JSON.stringify(data), {...init, headers: {"Content-Type":"application/json",...init?.headers}})}')
const limits = moduleUrl(compile(await readFile(new URL('../lib/submission-limit.ts', import.meta.url), 'utf8')))
const { reserveSubmission, submissionKey } = await import(limits)
const { POST } = await import(moduleUrl(compile(await readFile(new URL('../app/api/contributions/route.ts', import.meta.url), 'utf8')).replace("'next/server'", JSON.stringify(response)).replace("'@/lib/contributions'", JSON.stringify(contributions)).replace("'@/lib/submission-limit'", JSON.stringify(limits))))
const values = moduleUrl(compile(await readFile(new URL('../lib/firestore-values.ts', import.meta.url), 'utf8')))
const react = moduleUrl('export const cache = fn => fn')
const { publishedRecords, loadPublishedCollections } = await import(moduleUrl(compile(await readFile(new URL('../lib/public-content.ts', import.meta.url), 'utf8')).replace("import 'server-only';", '').replace("'react'", JSON.stringify(react)).replace("'./editorial'", JSON.stringify(editorial)).replace("'./firestore-values'", JSON.stringify(values))))
let requestNumber = 0
const request = (body, ip = `fixture-${++requestNumber}`) => new Request('http://localhost/api/contributions', { method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'http://localhost', 'x-test-ip': ip }, body: JSON.stringify(body) })

test('submission limits share a cooldown across forms, cap bursts and recover after the window', () => {
  const key = 'deterministic-rate-test'
  assert.equal(reserveSubmission(key, 1_000_000), 0)
  assert.equal(reserveSubmission(key, 1_000_001), 60)
  for (let index = 1; index < 5; index++) assert.equal(reserveSubmission(key, 1_000_000 + index * 60_000), 0)
  assert.equal(reserveSubmission(key, 1_300_000), 600)
  assert.equal(reserveSubmission(key, 1_900_000), 0)
  const previous = process.env.CONTRIBUTION_IP_HEADER
  delete process.env.CONTRIBUTION_IP_HEADER
  assert.equal(submissionKey(request({}, 'forged-a')), submissionKey(request({}, 'forged-b')))
  if (previous !== undefined) process.env.CONTRIBUTION_IP_HEADER = previous
})

test('contribution endpoint validates before writing and reports only confirmed commits as saved', async () => {
  const originalFetch = globalThis.fetch, originalProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'demo-local-tests'
  const originalHeader = process.env.CONTRIBUTION_IP_HEADER
  process.env.CONTRIBUTION_IP_HEADER = 'x-test-ip'
  const data = { type: 'messages', text: 'Local fixture only', name: '', consent: true }
  try {
    let calls = 0
    globalThis.fetch = async (_url, init) => {
      if (!init.body) return new Response('{}', { status: 404 })
      calls++
      const [write] = JSON.parse(init.body).writes
      assert.equal(write.update.fields.status.stringValue, 'pending')
      assert.equal(write.currentDocument.exists, false)
      assert.equal(write.updateTransforms[0].setToServerValue, 'REQUEST_TIME')
      assert.equal(JSON.parse(init.body).writes.length, 2)
      return new Response(JSON.stringify({ writeResults: [{ updateTime: '2026-10-07T00:00:00Z' }, { updateTime: '2026-10-07T00:00:00Z' }] }))
    }
    assert.equal((await POST(request({ ...data, status: 'published' }))).status, 400)
    assert.equal((await POST(request({ text: 'x'.repeat(6001) }))).status, 413)
    const crossOrigin = new Request('http://localhost/api/contributions', { method: 'POST', headers: { origin: 'https://other.example' }, body: '{}' })
    assert.equal((await POST(crossOrigin)).status, 403)
    assert.equal(calls, 0)
    assert.equal((await POST(request(data))).status, 201)
    assert.equal(calls, 1)
    assert.equal((await POST(request(data, 'same-visitor'))).status, 201)
    const blocked = await POST(request({ ...data, type: 'deeds' }, 'same-visitor'))
    assert.equal(blocked.status, 429)
    assert.ok(Number(blocked.headers.get('Retry-After')) > 0)
    assert.equal(calls, 2)
    globalThis.fetch = async () => new Response(JSON.stringify({ fields: { submittedAt: { timestampValue: new Date().toISOString() } }, updateTime: new Date().toISOString() }))
    assert.equal((await POST(request(data))).status, 429)
    globalThis.fetch = async (_url, init) => !init.body ? new Response('{}', { status: 404 }) : new Response('{}', { status: 409 })
    assert.equal((await POST(request(data))).status, 429)
    globalThis.fetch = async (_url, init) => !init.body ? new Response('{}', { status: 404 }) : new Response('{}', { status: 403 })
    assert.equal((await POST(request(data))).status, 503)
    globalThis.fetch = async () => new Response('{}', { status: 403 })
    assert.equal((await POST(request(data))).status, 503)
    globalThis.fetch = async () => new Response('{}')
    assert.equal((await POST(request(data))).status, 503)
    globalThis.fetch = async () => { throw new Error('Network unavailable') }
    assert.equal((await POST(request(data))).status, 503)
  } finally {
    globalThis.fetch = originalFetch
    if (originalHeader === undefined) delete process.env.CONTRIBUTION_IP_HEADER
    else process.env.CONTRIBUTION_IP_HEADER = originalHeader
    if (originalProject === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = originalProject
  }
})

test('public queries reject error envelopes and invalid records while preserving successful collections', async () => {
  const originalFetch = globalThis.fetch, originalProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'demo-local-tests'
  const record = { status: 'published', title: 'Local fixture', text: 'Fixture', type: 'Tài liệu', url: 'https://example.com', source: 'Fixture source', verifiedBy: 'Fixture verifier', verifiedOn: '2026-10-07' }
  const fields = data => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, { stringValue: value }]))
  try {
    globalThis.fetch = async (_url, init) => {
      const col = JSON.parse(init.body).structuredQuery.from[0].collectionId
      if (col === 'media') return new Response(JSON.stringify([{ error: { status: 'PERMISSION_DENIED' } }]))
      return new Response(JSON.stringify([
        { document: { name: 'projects/demo/library/valid', fields: fields(record) } },
        { document: { name: 'projects/demo/library/draft', fields: fields({ ...record, status: 'draft' }) } },
        { document: { name: 'projects/demo/library/malformed', fields: { ...fields(record), title: { integerValue: '123' } } } },
      ]))
    }
    assert.equal((await publishedRecords('library')).length, 1)
    await assert.rejects(publishedRecords('media'))
    const result = await loadPublishedCollections(['library', 'media'])
    assert.equal(result.records[0].length, 1)
    assert.deepEqual(result.records[1], [])
    assert.equal(result.unavailable, true)
  } finally {
    globalThis.fetch = originalFetch
    if (originalProject === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    else process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = originalProject
  }
})
