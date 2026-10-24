import { after, before, beforeEach, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run this test with the local Firestore emulator only.')
let env
function submitBatch(db, col, id, data) {
  const batch = writeBatch(db)
  batch.set(doc(db, col, id), data)
  batch.set(doc(db, 'submission_limits', 'public'), { collection: col, id, submittedAt: serverTimestamp() })
  return batch.commit()
}
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const moduleUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const firestoreUrl = pathToFileURL(createRequire(import.meta.url).resolve('firebase/firestore').replace('index.cjs.js', 'index.mjs')).href
const { importDraftEntries } = await import(moduleUrl(compile(await readFile(new URL('../lib/import-drafts.ts', import.meta.url), 'utf8')).replace("'firebase/firestore'", JSON.stringify(firestoreUrl))))
const editorialUrl = moduleUrl(compile(await readFile(new URL('../lib/editorial.ts', import.meta.url), 'utf8')))
const libraryUrl = moduleUrl(compile(await readFile(new URL('../lib/library.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorialUrl)))
const adminUrl = moduleUrl(compile(await readFile(new URL('../lib/admin.ts', import.meta.url), 'utf8')).replace("'./library'", JSON.stringify(libraryUrl)))
const { blankRecord } = await import(adminUrl)
const { updateAdminRecord, transitionAdminRecords } = await import(moduleUrl(compile(await readFile(new URL('../lib/admin-mutations.ts', import.meta.url), 'utf8')).replace("'firebase/firestore'", JSON.stringify(firestoreUrl)).replace("'./admin'", JSON.stringify(adminUrl)).replace("'./editorial'", JSON.stringify(editorialUrl))))
const { contributionWrite } = await import(moduleUrl(compile(await readFile(new URL('../lib/contributions.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorialUrl))))
const verifiedStory = { status: 'published', title: 'Test fixture', text: 'Local emulator fixture only', name: '', source: 'Test source', verifiedBy: 'Test verifier', verifiedOn: '2026-10-07', date: '2026-10-06' }
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-kp19', firestore: { rules: await readFile(new URL('../firebase/firestore.rules', import.meta.url), 'utf8') }, storage: { rules: await readFile(new URL('../firebase/storage.rules', import.meta.url), 'utf8') } }) })
beforeEach(async () => { await env.clearFirestore() })
after(async () => { await env.cleanup() })
test('guests can submit pending content and cannot inject moderation fields', async () => {
  const db = env.unauthenticatedContext().firestore()
  const pending = { text: 'Local test', name: '', consent: true, status: 'pending', createdAt: serverTimestamp() }
  await assertSucceeds(submitBatch(db, 'deeds', 'valid', { ...pending, title: 'Fixture', date: '2026-10-07' }))
  await assertFails(submitBatch(db, 'deeds', 'detailed', pending))
  await assertFails(setDoc(doc(db, 'deeds', 'without-consent'), { ...pending, consent: false }))
  await assertFails(setDoc(doc(db, 'deeds', 'published'), { ...pending, status: 'published' }))
  await assertFails(setDoc(doc(db, 'messages', 'injected'), { ...pending, verifiedBy: 'forged' }))
  await assertFails(setDoc(doc(db, 'messages', 'long'), { ...pending, name: 'x'.repeat(61) }))
  await assertFails(setDoc(doc(db, 'messages', 'timestamp'), { ...pending, createdAt: new Date(0) }))
  await assertFails(updateDoc(doc(db, 'deeds', 'valid'), { text: 'Changed' }))
})
test('public queries return only published content and cannot read drafts', async () => {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), 'stories', 'published'), verifiedStory)
    await setDoc(doc(ctx.firestore(), 'stories', 'draft'), { ...verifiedStory, status: 'draft' })
  })
  const db = env.unauthenticatedContext().firestore()
  await assertSucceeds(getDoc(doc(db, 'stories', 'published')))
  await assertFails(getDoc(doc(db, 'stories', 'draft')))
  await assertFails(getDocs(collection(db, 'stories')))
  await assertSucceeds(getDocs(query(collection(db, 'stories'), where('status', '==', 'published'))))
})

test('both contribution types stay private until an admin reviews and publishes them', async () => {
  const guest = env.unauthenticatedContext().firestore()
  const admin = env.authenticatedContext('reviewer', { admin: true }).firestore()
  for (const col of ['deeds', 'messages']) {
    const id = `review-${col}`
    await env.withSecurityRulesDisabled(async ctx => { await setDoc(doc(ctx.firestore(), 'submission_limits', 'public'), { collection: 'messages', id: 'old-fixture', submittedAt: Timestamp.fromMillis(0) }) })
    await assertSucceeds(submitBatch(guest, col, id, { text: 'Local review fixture', name: '', consent: true, status: 'pending', createdAt: serverTimestamp() }))
    await assertFails(getDoc(doc(guest, col, id)))
    assert.equal((await getDoc(doc(admin, col, id))).data().status, 'pending')
    await assertFails(updateDoc(doc(admin, col, id), { title: 'Reviewed fixture', status: 'published' }))
    await assertSucceeds(updateDoc(doc(admin, col, id), { title: 'Reviewed fixture', status: 'verified', source: 'Emulator submission', verifiedBy: 'reviewer', verifiedOn: '2026-10-24' }))
    await assertFails(getDoc(doc(guest, col, id)))
    await assertSucceeds(updateDoc(doc(admin, col, id), { status: 'published' }))
    const result = await assertSucceeds(getDoc(doc(guest, col, id)))
    assert.equal(result.data().text, 'Local review fixture')
    assert.equal(result.data().consent, true)
    await assertSucceeds(updateDoc(doc(admin, col, id), { status: 'draft' }))
    await assertFails(getDoc(doc(guest, col, id)))
  }
})
test('authentication without an admin claim cannot manage content', async () => {
  const db = env.authenticatedContext('ordinary-user').firestore()
  await assertFails(setDoc(doc(db, 'stories', 'forbidden'), verifiedStory))
  await assertFails(getDocs(collection(db, 'stories')))
  await assertFails(setDoc(doc(db, 'unmanaged', 'forbidden'), verifiedStory))
})
test('admins must supply evidence and photo permissions', async () => {
  const db = env.authenticatedContext('admin-user', { admin: true }).firestore()
  await assertSucceeds(setDoc(doc(db, 'stories', 'story'), verifiedStory))
  await assertFails(setDoc(doc(db, 'stories', 'no-source'), { ...verifiedStory, source: '' }))
  const media = { ...verifiedStory, category: 'hero', url: '/images/test.webp', photographer: 'Fixture photographer' }
  await assertFails(setDoc(doc(db, 'media', 'no-permission'), media))
  await assertSucceeds(setDoc(doc(db, 'media', 'valid'), { ...media, permission: 'Test permission' }))
  await assertFails(setDoc(doc(db, 'site_stats', 'no-period'), { ...verifiedStory, value: 0 }))
  await assertSucceeds(setDoc(doc(db, 'site_stats', 'valid'), { ...verifiedStory, value: 0, period: 'Test period' }))
})
test('new CMS collections obey the same editorial boundary', async () => {
  const db = env.authenticatedContext('admin-user', { admin: true }).firestore()
  await assertSucceeds(setDoc(doc(db, 'activities', 'valid'), { ...verifiedStory, category: 'Fixture category' }))
  await assertFails(setDoc(doc(db, 'activities', 'invalid'), { ...verifiedStory, category: '' }))
  await assertSucceeds(setDoc(doc(db, 'quiz_questions', 'valid'), { ...verifiedStory, options: 'One\nTwo', correct: 1 }))
  await assertFails(setDoc(doc(db, 'quiz_questions', 'invalid'), { ...verifiedStory, options: 'One\nTwo', correct: 9 }))
  await assertSucceeds(setDoc(doc(db, 'daily_challenges', 'valid'), { ...verifiedStory, category: 'Fixture category' }))
})
test('Storage uploads require admin, approved MIME types and size limits', async () => {
  const guest = env.unauthenticatedContext().storage()
  const ordinary = env.authenticatedContext('ordinary').storage()
  const admin = env.authenticatedContext('admin', { admin: true }).storage()
  const file = new Uint8Array([1, 2, 3])
  await assertFails(uploadBytes(ref(guest, 'editorial/guest.png'), file, { contentType: 'image/png' }))
  await assertFails(uploadBytes(ref(ordinary, 'editorial/ordinary.png'), file, { contentType: 'image/png' }))
  await assertSucceeds(uploadBytes(ref(admin, 'editorial/admin.png'), file, { contentType: 'image/png' }))
  await assertFails(uploadBytes(ref(admin, 'editorial/executable.exe'), file, { contentType: 'application/octet-stream' }))
  await assertFails(uploadBytes(ref(admin, 'editorial/large.png'), new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'image/png' }))
})

test('database starter import requires admin and preserves edited records when repeated', async () => {
  const entry = { collection: 'library', id: 'curated-fixture', record: { ...verifiedStory, status: 'draft', source: 'Test source', verifiedBy: '', verifiedOn: '', url: 'https://example.com', type: 'Tài liệu', curatedId: 'fixture' } }
  await assertFails(importDraftEntries(env.authenticatedContext('ordinary').firestore(), 'ordinary', [entry]))
  const db = env.authenticatedContext('admin-user', { admin: true }).firestore()
  assert.deepEqual(await importDraftEntries(db, 'admin-user', [entry]), { imported: 1, skipped: 0 })
  await updateDoc(doc(db, 'library', entry.id), { title: 'Edited fixture' })
  assert.deepEqual(await importDraftEntries(db, 'admin-user', [entry]), { imported: 0, skipped: 1 })
  const saved = (await getDoc(doc(db, 'library', entry.id))).data()
  assert.equal(saved.title, 'Edited fixture')
  assert.equal(saved.status, 'draft')
  assert.equal(saved.updatedBy, 'admin-user')
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'library', entry.id)))
})

test('public REST commit uses a server timestamp and cannot publish or bypass Rules', async () => {
  const endpoint = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/demo-kp19/databases/(default)/documents:commit`
  const write = contributionWrite('demo-kp19', 'rest-fixture', { type: 'deeds', text: 'Local emulator test', name: '', consent: true })
  const gate = id => ({ update: { name: 'projects/demo-kp19/databases/(default)/documents/submission_limits/public', fields: { collection: { stringValue: 'deeds' }, id: { stringValue: id } } }, updateTransforms: [{ fieldPath: 'submittedAt', setToServerValue: 'REQUEST_TIME' }] })
  const send = writes => fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ writes }) })
  assert.equal((await send([write])).status, 403)
  const response = await send([write, gate('rest-fixture')])
  assert.equal(response.status, 200)
  const db = env.authenticatedContext('admin-user', { admin: true }).firestore()
  const saved = (await getDoc(doc(db, 'deeds', 'rest-fixture'))).data()
  assert.equal(saved.status, 'pending')
  assert.equal(saved.consent, true)
  assert.ok(saved.createdAt.toMillis() > 0)
  const fast = contributionWrite('demo-kp19', 'rest-too-fast', { type: 'deeds', text: 'Local test', name: '', consent: true })
  assert.equal((await send([fast, gate('rest-too-fast')])).status, 403)
  const forged = contributionWrite('demo-kp19', 'rest-forged', { type: 'messages', text: 'Local test', name: '', consent: true })
  forged.update.fields.status.stringValue = 'published'
  assert.equal((await send([forged])).status, 403)
})

test('quota cannot be reserved alone or reused, and parallel guests share the same cooldown', async () => {
  const guest = env.unauthenticatedContext().firestore()
  const data = { text: 'Emulator only', name: '', consent: true, status: 'pending', createdAt: serverTimestamp() }
  await assertFails(setDoc(doc(guest, 'submission_limits', 'public'), { collection: 'messages', id: 'missing', submittedAt: serverTimestamp() }))
  const results = await Promise.allSettled([submitBatch(guest, 'deeds', 'parallel-a', data), submitBatch(guest, 'messages', 'parallel-b', data)])
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1)
  await assertFails(setDoc(doc(guest, 'messages', 'bypass'), data))
  await assertFails(getDocs(collection(guest, 'submission_limits')))
  await env.withSecurityRulesDisabled(async ctx => { await updateDoc(doc(ctx.firestore(), 'submission_limits', 'public'), { submittedAt: Timestamp.fromMillis(0) }) })
  await assertSucceeds(submitBatch(guest, 'messages', 'after-cooldown', data))
})

test('admin saves and bulk moderation reject stale editors without overwriting another reviewer', async () => {
  const db = env.authenticatedContext('reviewer', { admin: true }).firestore()
  const original = { ...blankRecord(), ...verifiedStory, consent: true, status: 'pending' }
  await setDoc(doc(db, 'messages', 'review-a'), original)
  await setDoc(doc(db, 'messages', 'review-b'), original)
  const first = { ...original, id: 'review-a' }, second = { ...original, id: 'review-b' }
  await updateAdminRecord(db, 'messages', { ...first, text: 'Updated by first reviewer' }, first, 'reviewer')
  await assert.rejects(updateAdminRecord(db, 'messages', { ...first, text: 'Stale overwrite' }, first, 'reviewer'), /EDIT_CONFLICT/)
  await assert.rejects(transitionAdminRecords(db, 'messages', [first, second], 'published', 'reviewer'), /EDIT_CONFLICT/)
  assert.equal((await getDoc(doc(db, 'messages', 'review-b'))).data().status, 'pending')
  const latest = { ...blankRecord(), ...(await getDoc(doc(db, 'messages', 'review-a'))).data(), id: 'review-a' }
  await transitionAdminRecords(db, 'messages', [latest, second], 'published', 'reviewer')
  assert.equal((await getDoc(doc(db, 'messages', 'review-a'))).data().text, 'Updated by first reviewer')
  assert.equal((await getDoc(doc(db, 'messages', 'review-b'))).data().status, 'published')
  const published = { ...blankRecord(), ...(await getDoc(doc(db, 'messages', 'review-b'))).data(), id: 'review-b' }
  await assertFails(updateAdminRecord(env.authenticatedContext('ordinary').firestore(), 'messages', { ...published, title: 'Unauthorized' }, published, 'ordinary'))
})
