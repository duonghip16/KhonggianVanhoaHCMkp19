import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = ts.transpileModule(await readFile(new URL('../lib/media-upload.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const diagnostics = `data:text/javascript;base64,${Buffer.from(ts.transpileModule(await readFile(new URL('../lib/server-diagnostics.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`
const { handleMediaUpload } = await import(`data:text/javascript;base64,${Buffer.from(source.replace("'./server-diagnostics'", JSON.stringify(diagnostics))).toString('base64')}`)
const config = { privateKey: 'test-secret', urlEndpoint: 'https://ik.imagekit.io/test-account' }
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), Buffer.alloc(20)])
function request(bytes = png, type = 'image/png', token = 'valid-token') {
  const form = new FormData()
  form.set('file', new Blob([bytes], { type }), 'original.png')
  return new Request('https://example.test/api/media/upload', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form })
}
test('only authenticated admins can reach ImageKit; files and returned URLs are checked', async () => {
  const originalFetch = globalThis.fetch
  let uploads = 0
  try {
    globalThis.fetch = async (url, options) => {
      uploads++
      assert.equal(url, 'https://upload.imagekit.io/api/v1/files/upload')
      assert.equal(options.headers.Authorization, `Basic ${Buffer.from('test-secret:').toString('base64')}`)
      assert.equal(options.body.get('folder'), '/kp19/editorial')
      assert.match(options.body.get('fileName'), /^[\w-]+\.png$/)
      return Response.json({ fileId: 'file-123', url: 'https://ik.imagekit.io/test-account/kp19/editorial/image.png' })
    }
    assert.equal((await handleMediaUpload(request(png, 'image/png', ''), async () => true, config)).status, 401)
    assert.equal((await handleMediaUpload(request(), async () => false, config)).status, 403)
    assert.equal((await handleMediaUpload(request(), async () => { throw Error('bad signature') }, config)).status, 401)
    assert.equal((await handleMediaUpload(request(), async () => true, {})).status, 503)
    assert.equal((await handleMediaUpload(request(png, 'image/svg+xml'), async () => true, config)).status, 415)
    assert.equal((await handleMediaUpload(request(Buffer.from('script hidden in fake image')), async () => true, config)).status, 415)
    assert.equal((await handleMediaUpload(request(Buffer.alloc(5 * 1024 * 1024 + 1)), async () => true, config)).status, 413)
    assert.equal((await handleMediaUpload(request(Buffer.alloc(6 * 1024 * 1024)), async () => true, config)).status, 413)
    assert.equal(uploads, 0)
    const success = await handleMediaUpload(request(), async token => { assert.equal(token, 'valid-token'); return true }, config)
    assert.equal(success.status, 201)
    assert.deepEqual(await success.json(), { url: 'https://ik.imagekit.io/test-account/kp19/editorial/image.png' })
    for (const data of [{ fileId: '123', url: 'https://other.test/image.png' }, { fileId: '123', url: 'https://ik.imagekit.io/test-account-other/image.png' }, {}]) {
      globalThis.fetch = async () => Response.json(data)
      assert.equal((await handleMediaUpload(request(), async () => true, config)).status, 502)
    }
    globalThis.fetch = async () => new Response('private upstream error test-secret', { status: 403 })
    const failure = await handleMediaUpload(request(), async () => true, config)
    assert.equal(failure.status, 502)
    assert.equal((await failure.text()).includes('test-secret'), false)
    globalThis.fetch = async () => { throw Error('timeout test-secret') }
    assert.equal((await handleMediaUpload(request(), async () => true, config)).status, 502)
  } finally { globalThis.fetch = originalFetch }
})
