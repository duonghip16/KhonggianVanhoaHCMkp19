import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
const base = 'http://localhost:3100'
const downloadRoot = path.resolve('.qa', `downloads-${Date.now()}`)
let targets = []
for (let attempt = 0; attempt < 30; attempt++) {
  try { targets = await (await fetch('http://127.0.0.1:9223/json')).json(); if (targets.some(item => item.type === 'page')) break } catch {}
  await delay(350)
}
const target = targets.find(item => item.type === 'page' && item.url.startsWith(base))
  || targets.find(item => item.type === 'page' && !item.url.startsWith('edge://'))
assert.ok(target)
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let nextId = 0
const pending = new Map(), errors = []
socket.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  const waiter = pending.get(message.id)
  if (waiter) { pending.delete(message.id); message.error ? waiter.reject(message.error) : waiter.resolve(message.result) }
}
function command(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
  return result.result.value
}
async function settle() {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate('document.readyState === "complete" && !!document.querySelector("h1")')) break
    await delay(250)
  }
  await delay(700)
}
await mkdir('.qa', { recursive: true })
await mkdir(downloadRoot, { recursive: true })
try {
  await command('Page.enable'); await command('Runtime.enable')
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  for (const width of process.env.QA_INTERACTIONS_ONLY ? [] : [360, 390, 430, 768, 1024, 1280, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 500 })
    for (const route of ['/', '/ve-bac', '/hoc-va-lam-theo-bac', '/khu-pho-19', '/cau-chuyen', '/vuon-hoa-viec-tot', '/thu-vien', '/tuong-tac']) {
      await command('Page.navigate', { url: base + route }); await settle()
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `Overflow at ${width}px on ${route}`)
      assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1, `H1 count on ${route}`)
      assert.equal(await evaluate('!!document.querySelector("#main")'), true, `Skip link target on ${route}`)
      if (width === 390 || route === '/') {
        const screenshot = await command('Page.captureScreenshot', { format: 'png' })
        await writeFile(`.qa/${route === '/' ? 'home' : route.slice(1)}-${width}.png`, Buffer.from(screenshot.data, 'base64'))
      }
    }
    console.log(`PASS: eight public routes at ${width}px`)
  }
  await command('Page.navigate', { url: base }); await settle()
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await evaluate("document.querySelector('.mobile-menu summary').click()")
  assert.equal(await evaluate("document.querySelector('.mobile-menu').open"), true)
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.mobile-menu nav ul')).display"), 'flex')
  await evaluate("document.querySelector('.mobile-menu summary').click()")
  await command('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadRoot })
  await command('Page.navigate', { url: base + '/tuong-tac' }); await settle(); await settle()
  for (let question = 0; question < 30 && !(await evaluate('!!document.querySelector(".qres")')); question++) {
    await evaluate("document.querySelector('.opt').click()")
    await settle()
    await evaluate("document.querySelector('.why button').click()")
    await settle()
  }
  await evaluate("document.querySelector('.qact button').click()")
  await settle()
  const png = await readFile(path.join(downloadRoot, 'huy-hieu-khu-pho-19.png'))
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  assert.equal(png.readUInt32BE(16), 800); assert.equal(png.readUInt32BE(20), 1000)
  await command('Page.navigate', { url: base + '/ve-bac' }); await settle()
  await evaluate("document.querySelector('.milestone-tabs [role=tab]').dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight', bubbles:true}))")
  assert.equal(await evaluate("document.querySelector('.milestone-panel[role=tabpanel]').textContent.includes('05/06/1911')"), true)
  await command('Page.navigate', { url: base + '/hoc-va-lam-theo-bac' }); await settle()
  await evaluate("document.querySelector('.petal-3').click()")
  assert.equal(await evaluate("document.querySelector('.value-panel h3').textContent"), 'Đoàn kết')
  await evaluate("document.querySelector('.practice-checklist input').click();document.querySelector('.practice-plan-actions button').click()")
  await settle()
  const planFile = (await readdir(downloadRoot)).find(name => name.startsWith('ke-hoach-') && name.endsWith('.html'))
  assert.ok(planFile, 'Plan HTML downloaded')
  const planHtml = await readFile(path.join(downloadRoot, planFile), 'utf8')
  assert.match(planHtml, /In \/ Lưu PDF/)
  assert.match(planHtml, /type="checkbox" checked/)
  await command('Page.navigate', { url: base + '/cau-chuyen' }); await settle()
  assert.ok(await evaluate('document.querySelectorAll(".story").length >= 8'))
  await evaluate("document.querySelector('.story-photo-link').click()"); await settle()
  assert.equal(await evaluate('!!document.querySelector(".story-popup[open]")'), true)
  assert.equal(await evaluate('location.pathname'), '/cau-chuyen')
  await evaluate("document.querySelector('[aria-label=\"Đóng câu chuyện\"]').click()"); await settle()
  assert.equal(await evaluate('!!document.querySelector(".story-popup[open]")'), false)
  await command('Page.navigate', { url: base + '/vuon-hoa-viec-tot' }); await settle()
  await evaluate("document.querySelector('.fl').click()")
  await settle()
  assert.equal(await evaluate("document.querySelector('.deed-dialog').open"), true)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await settle()
  assert.equal(await evaluate("document.querySelector('.deed-dialog').open"), false)
  await evaluate("Array.from(document.querySelectorAll('.share-button')).find(button => button.textContent.includes('Mã QR')).click()")
  await settle(); await settle()
  assert.equal(await evaluate("document.querySelector('.qr-card img')?.src.startsWith('data:image/png')"), true)
  await evaluate("document.querySelector('.qr-card a').click()")
  await settle()
  const qr = await readFile(path.join(downloadRoot, 'qr-khu-pho-19.png'))
  assert.equal(qr.readUInt32BE(16), 512); assert.equal(qr.readUInt32BE(20), 512)
  for (const route of ['/admin', '/cau-chuyen', '/thu-vien']) {
    await command('Page.navigate', { url: base + route }); await settle()
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `Overflow on ${route}`)
  }
  const og = await fetch(base + '/opengraph-image')
  assert.equal(og.status, 200); assert.match(og.headers.get('content-type'), /image\/png/)
  const ogBytes = Buffer.from(await og.arrayBuffer())
  assert.equal(ogBytes.readUInt32BE(16), 1200); assert.equal(ogBytes.readUInt32BE(20), 630)
  await writeFile('.qa/opengraph.png', ogBytes)
  assert.equal((await fetch(base + '/cau-chuyen/khong-ton-tai')).status, 404)
  const html = await (await fetch(base)).text()
  assert.match(html.split('</head>')[0], /<meta name="description" content="[^"]+"/)
  assert.equal((await fetch(base + '/robots.txt')).status, 200)
  assert.equal((await fetch(base + '/sitemap.xml')).status, 200)
  assert.equal((await fetch(base + '/api/community?type=admin')).status, 400)
  assert.equal((await fetch(base + '/admin/hoat-dong')).status, 200)
  assert.equal((await fetch(base + '/admin/quiz')).status, 200)
  await command('Page.navigate', { url: base + '/thu-vien' }); await settle()
  for (const type of ['Sách', 'Hình ảnh', 'Video', 'Audio', 'Infographic', 'Tài liệu']) {
    await evaluate(`Array.from(document.querySelectorAll('.library-filter')).find(button=>button.textContent.startsWith(${JSON.stringify(type)})).click()`)
    await settle()
    await evaluate("(document.querySelector('.library-title-button') || document.querySelector('.library-image-button')).click()")
    await settle()
    assert.equal(await evaluate('!!document.querySelector(".library-preview[open]")'), true, `Reader for ${type}`)
    assert.equal(await evaluate('!!document.querySelector(".library-preview[open] a[href]")'), true, `Source for ${type}`)
    await evaluate('document.querySelector(".library-preview-bar button").click()'); await settle()
  }
  await command('Emulation.setEmulatedMedia', { features: [] })
  await command('Page.navigate', { url: base }); await settle(); await settle()
  await evaluate("document.querySelector('#steps').scrollIntoView({block:'center'})")
  await settle(); await settle()
  assert.equal(await evaluate("parseFloat(document.querySelector('#prog').style.height) > 0"), true, 'GSAP timeline progress')
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  assert.deepEqual(errors, [])
  console.log('PASS: '+(process.env.QA_INTERACTIONS_ONLY ? 'critical interactions' : 'eight public routes at seven widths')+', six library formats, mobile menu, keyboard timeline, GSAP, reduced motion, value lotus, accessible dialog, PNG 800x1000, QR 512x512, OG 1200x630, admin routes, sitemap, robots, 404, no runtime exceptions.')
} finally { socket.close() }
