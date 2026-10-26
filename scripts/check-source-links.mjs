import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import ts from 'typescript'

// Read-only, bounded requests to URLs already declared in the source data.
const links = new Map()
for (const name of await readdir('data')) {
  if (!name.endsWith('.ts')) continue
  const file = `data/${name}`
  const tree = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true)
  function visit(node) {
    if (ts.isStringLiteral(node) && node.text.startsWith('https://')) {
      const url = new URL(node.text.replaceAll('{page}', '2'))
      url.hash = ''
      links.set(url.href, [...new Set([...(links.get(url.href) || []), file])])
    }
    ts.forEachChild(node, visit)
  }
  visit(tree)
}

const queue = [...links], results = []
async function worker() {
  while (queue.length) {
    const [url, files] = queue.shift()
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { Range: 'bytes=0-1023' } })
      await response.body?.cancel()
      const state = response.ok ? 'reachable' : [404, 410].includes(response.status) ? 'broken' : 'needs-review'
      results.push({ url, files, state, status: response.status, finalUrl: response.url })
    } catch { results.push({ url, files, state: 'needs-review', reason: 'network-or-timeout' }) }
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
results.sort((a, b) => a.url.localeCompare(b.url))
const summary = Object.fromEntries(['reachable', 'broken', 'needs-review'].map(state => [state, results.filter(item => item.state === state).length]))
await mkdir('.qa', { recursive: true })
await writeFile('.qa/source-links.json', JSON.stringify({ checkedAt: new Date().toISOString(), summary, results }, null, 2))
console.log(JSON.stringify({ summary, report: '.qa/source-links.json', issues: results.filter(item => item.state !== 'reachable') }, null, 2))
if (summary.broken) process.exitCode = 1
