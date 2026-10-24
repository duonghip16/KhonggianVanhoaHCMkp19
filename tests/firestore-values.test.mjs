import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../lib/firestore-values.ts', import.meta.url), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { decodeFirestoreFields } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
test('Firestore REST values preserve consent, zero values, empty arrays and nested metadata', () => {
  assert.deepEqual(decodeFirestoreFields({ consent: { booleanValue: true }, value: { integerValue: '0' }, score: { doubleValue: 1.5 }, options: { arrayValue: {} }, source: { mapValue: { fields: { url: { stringValue: 'https://example.com' } } } }, empty: { nullValue: null } }), { consent: true, value: 0, score: 1.5, options: [], source: { url: 'https://example.com' }, empty: null })
})
