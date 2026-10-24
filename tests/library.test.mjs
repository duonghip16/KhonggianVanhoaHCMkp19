import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'

const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const moduleUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const editorial = moduleUrl(compile(await readFile(new URL('../lib/editorial.ts', import.meta.url), 'utf8')))
const source = compile(await readFile(new URL('../lib/library.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorial))
const { filterLibrary, prepareLibrary } = await import(moduleUrl(source))
const historicalMedia = moduleUrl(compile(await readFile(new URL('../data/historical-media.ts', import.meta.url), 'utf8')))
const biography = moduleUrl(compile(await readFile(new URL('../data/biography.ts', import.meta.url), 'utf8')).replace("'./historical-media'", JSON.stringify(historicalMedia)))
const readings = moduleUrl(compile(await readFile(new URL('../data/library-readings.ts', import.meta.url), 'utf8')).replace("'./historical-media'", JSON.stringify(historicalMedia)).replace("'./biography'", JSON.stringify(biography)))
const multimedia = moduleUrl(compile(await readFile(new URL('../data/library-multimedia.ts', import.meta.url), 'utf8')).replace("'./historical-media'", JSON.stringify(historicalMedia)))
const additions = moduleUrl(compile(await readFile(new URL('../data/library-additions.ts', import.meta.url), 'utf8')).replace("'./historical-media'", JSON.stringify(historicalMedia)))
const content = compile(await readFile(new URL('../data/content.ts', import.meta.url), 'utf8')).replace("'./historical-media'", JSON.stringify(historicalMedia)).replace("'./library-readings'", JSON.stringify(readings)).replace("'./library-multimedia'", JSON.stringify(multimedia)).replace("'./library-additions'", JSON.stringify(additions))
const { LIBRARY, SOURCES, HISTORY, VALUES, QUOTE } = await import(moduleUrl(content))
const contentUrl = moduleUrl(content)
const practiceUrl = moduleUrl(compile(await readFile(new URL('../data/practice.ts', import.meta.url), 'utf8')).replace("'./content'", JSON.stringify(contentUrl)))
const seedUrl = moduleUrl(compile(await readFile(new URL('../lib/seed-content.ts', import.meta.url), 'utf8')).replace("'@/data/content'", JSON.stringify(contentUrl)).replace("'@/data/practice'", JSON.stringify(practiceUrl)))
const { starterContent } = await import(seedUrl)
const libraryMediaUrl = moduleUrl(compile(await readFile(new URL('../lib/library-media.ts', import.meta.url), 'utf8')).replace("'./editorial'", JSON.stringify(editorial)))
const { libraryMedia } = await import(libraryMediaUrl)
const { managedLibraryItem } = await import(moduleUrl(compile(await readFile(new URL('../lib/managed-library.ts', import.meta.url), 'utf8')).replace("'@/data/content'", JSON.stringify(contentUrl)).replace("'./library-media'", JSON.stringify(libraryMediaUrl))))

test('managed library media supports on-site viewers without accepting arbitrary embeds', () => {
  const record = { title: 'Local fixture', source: 'Source fixture', url: 'https://ik.imagekit.io/account/photo.png', type: 'Hình ảnh' }
  assert.equal(libraryMedia(record).kind, 'image')
  assert.equal(libraryMedia({ ...record, type: 'Tài liệu', url: '/books/file.pdf' }).kind, 'pdf')
  assert.equal(libraryMedia({ ...record, type: 'Audio', url: 'https://example.test/voice.mp3' }).kind, 'audio')
  assert.equal(libraryMedia({ ...record, type: 'Video', url: 'https://youtu.be/AtbQeFo0c0U' }).src, 'https://www.youtube-nocookie.com/embed/AtbQeFo0c0U')
  assert.equal(libraryMedia({ ...record, type: 'Video', url: 'https://youtube.com.evil.test/watch?v=AtbQeFo0c0U' }), undefined)
  assert.equal(libraryMedia({ ...record, url: 'javascript:alert(1)' }), undefined)
  assert.equal(libraryMedia({ ...record, url: '/\\evil.test/image.png' }), undefined)
  assert.equal(libraryMedia({ ...record, url: 'https://name:secret@example.test/image.png' }), undefined)
})

test('starter database content contains only drafts with sources, unique IDs and no invented community records', () => {
  const entries = starterContent()
  assert.equal(entries.filter(item => item.collection === 'library').length, LIBRARY.length)
  assert.equal(entries.filter(item => item.collection === 'quiz_questions').length, 5)
  assert.equal(entries.filter(item => item.collection === 'daily_challenges').length, 4)
  assert.equal(new Set(entries.map(item => `${item.collection}/${item.id}`)).size, entries.length)
  for (const entry of entries) {
    assert.ok(['library', 'quiz_questions', 'daily_challenges'].includes(entry.collection))
    assert.equal(entry.record.status, 'draft')
    assert.equal(entry.record.verifiedBy, '')
    assert.equal(entry.record.verifiedOn, '')
    assert.ok(entry.record.source.trim())
  }
})

test('published CMS library records retain reading, media, photo rights and existing deep links', () => {
  for (const entry of starterContent().filter(item => item.collection === 'library')) {
    const original = LIBRARY.find(item => item.id === entry.record.curatedId)
    const managed = managedLibraryItem({ ...entry.record, id: entry.id, status: 'published', title: 'Tiêu đề đã biên tập' })
    assert.equal(managed.id, original.id)
    assert.equal(managed.title, 'Tiêu đề đã biên tập')
    assert.deepEqual(managed.reading, original.reading)
    assert.deepEqual(managed.media, original.media)
    assert.deepEqual(managed.image, original.image)
  }
})

test('unpublished records and changed sources cannot attach unrelated curated media', () => {
  const entry = starterContent()[0]
  assert.equal(managedLibraryItem({ ...entry.record, id: entry.id }), null)
  const managed = managedLibraryItem({ ...entry.record, id: entry.id, status: 'published', url: 'https://example.com/new' })
  assert.equal(managed.reading, undefined)
  assert.equal(managed.id, `cms:${entry.id}`)
})
const library = [
  { id: 'ethics', title: 'Đạo đức Hồ Chí Minh', description: 'Cần, kiệm, liêm, chính', source: 'Tư liệu Văn kiện Đảng', type: 'Tài liệu', status: 'published', url: 'https://example.com/ethics' },
  { id: 'portrait', title: 'Chân dung Chủ tịch Hồ Chí Minh', source: 'Gallica', type: 'Hình ảnh', status: 'published', url: 'https://example.com/portrait' },
]

test('Vietnamese search accepts accents, no accents, uppercase and extra spaces', () => {
  for (const query of ['ĐẠO ĐỨC', 'dao duc', '  DAO   DUC  ']) assert.deepEqual(filterLibrary(library, 'Tất cả', query).map(item => item.id), ['ethics'])
  assert.equal(filterLibrary(library, 'Tất cả', 'ho chi minh').length, 2)
})

test('search combines terms from title, description and source with the selected type', () => {
  assert.equal(filterLibrary(library, 'Tài liệu', 'kiem dang').length, 1)
  assert.equal(filterLibrary(library, 'Hình ảnh', 'kiem dang').length, 0)
  assert.equal(filterLibrary(library, 'Tất cả', 'Gallica').length, 1)
  assert.equal(filterLibrary(library, 'Tất cả', 'khong co tu lieu nay').length, 0)
  assert.equal(filterLibrary(library, 'Tất cả', '   ').length, 2)
})

test('public catalog omits unpublished records, unsafe links and duplicate sources', () => {
  const catalog = prepareLibrary([...library,
    { ...library[0], id: 'draft', status: 'draft', url: 'https://example.com/draft' },
    { ...library[0], id: 'unsafe', url: 'javascript:alert(1)' },
    { ...library[0], id: 'duplicate-url' },
    { ...library[1], url: 'https://example.com/duplicate-id' },
  ])
  assert.deepEqual(catalog.map(item => item.id), ['ethics', 'portrait'])
})

test('every curated article source used across pages has an on-site reading with a related image', () => {
  const urls = new Set([...Object.values(SOURCES), ...HISTORY.map(item => item.source), ...VALUES.map(item => item.source), QUOTE.source])
  for (const url of urls) {
    const item = LIBRARY.find(entry => entry.url === url)
    assert.ok(item?.reading, `Missing on-site reading: ${url}`)
    assert.equal(item.status, 'published')
    assert.ok(item.source)
    assert.ok(item.reading.image.sourceUrl.startsWith('https://'))
    assert.ok(item.reading.image.src.startsWith('/images/'))
    assert.ok(item.reading.sections.every(section => section.title && section.paragraphs.every(Boolean)))
  }
})

test('distinct formats from a shared source remain available without duplicating the same format', () => {
  const variants = [library[0], { ...library[0], id: 'graphic', type: 'Infographic' }, { ...library[0], id: 'second-document' }]
  assert.deepEqual(prepareLibrary(variants).map(item => item.id), ['ethics', 'graphic'])
})

test('all six curated formats contain usable content and documented provenance', () => {
  for (const type of ['Sách', 'Hình ảnh', 'Video', 'Audio', 'Infographic', 'Tài liệu']) {
    const items = prepareLibrary(LIBRARY).filter(item => item.type === type)
    assert.ok(items.length >= 3, `Fewer than three items: ${type}`)
    for (const item of items) {
      assert.ok(item.source && item.description && item.url.startsWith('https://'))
      assert.ok(item.reading || item.image || item.media)
      if (item.media) assert.ok(item.media.credit && item.media.src)
      if (item.media?.kind === 'book') assert.ok(item.media.pages > 1 && item.media.licenseUrl)
    }
  }
})

test('biography covers the full life with section sources and contextual images', () => {
  const sections = LIBRARY.find(item => item.id === 'tieu-su').reading.sections
  assert.ok(sections.length >= 10)
  const body = sections.flatMap(section => section.paragraphs).join(' ')
  assert.ok(body.split(/\s+/).length >= 1000)
  for (const landmark of ['1890', '1911', '1920', '1930', '1941', '1945', '1946', '1954', '1965', '1969']) assert.ok(body.includes(landmark), landmark)
  assert.ok(sections.every(section => section.source?.url.startsWith('https://')))
  assert.ok(new Set(sections.map(section => section.source.url)).size >= 7)
  assert.ok(sections.filter(section => section.image?.sourceUrl).length >= 2)
})

test('book introductions are explicitly distinguished from full scans', () => {
  const guides = LIBRARY.filter(item => item.media?.kind === 'book-guide')
  assert.equal(guides.length, 2)
  for (const item of guides) {
    assert.ok(item.media.credit.includes('không phải bìa một ấn bản gốc'))
    assert.ok(item.reading.sections.some(section => section.paragraphs.some(paragraph => /không phải toàn văn|không sao chép toàn/.test(paragraph))))
  }
})
