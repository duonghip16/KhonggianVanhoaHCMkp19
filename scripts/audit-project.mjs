import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import ts from 'typescript'

const root = process.cwd()
const excluded = new Set(['node_modules', '.next', '.next-dev', '.qa', '.git'])
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (entry.isSymbolicLink() || excluded.has(entry.name)) return []
  const filename = path.join(directory, entry.name)
  return entry.isDirectory() ? walk(filename) : [filename]
})
const relative = filename => path.relative(root, filename).replaceAll('\\', '/')
const files = walk(root)
const source = files.filter(filename => /\.(tsx?|mjs)$/.test(filename))
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options
const graph = new Map()
for (const filename of source) {
  const parsed = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true)
  const dependencies = new Set()
  function visit(node) {
    const literal = (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ? node.moduleSpecifier
      : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : undefined
    if (literal && ts.isStringLiteral(literal)) {
      const target = ts.resolveModuleName(literal.text, filename, options, ts.sys).resolvedModule?.resolvedFileName
      if (target && !target.includes('node_modules')) dependencies.add(path.resolve(target))
    }
    ts.forEachChild(node, visit)
  }
  visit(parsed)
  graph.set(path.resolve(filename), dependencies)
}
// Next.js discovers app entry points by convention. Scripts/tests are independent entry points.
const entries = source.filter(filename => /^(app|scripts|tests)\//.test(relative(filename)))
const reached = new Set()
function follow(filename) {
  if (reached.has(filename)) return
  reached.add(filename)
  for (const dependency of graph.get(filename) || []) follow(dependency)
}
entries.forEach(follow)
const code = source.map(filename => ({ filename: relative(filename), text: fs.readFileSync(filename, 'utf8') }))
const docs = files.filter(filename => filename.endsWith('.md')).map(filename => ({ filename: relative(filename), text: fs.readFileSync(filename, 'utf8') }))
const assets = files.filter(filename => relative(filename).startsWith('public/')).map(filename => {
  const url = '/' + relative(filename).slice(7)
  return { path: relative(filename), url, bytes: fs.statSync(filename).size,
    codeReferences: code.filter(file => file.text.includes(url)).map(file => file.filename),
    documentationReferences: docs.filter(file => file.text.includes(path.basename(filename))).map(file => file.filename) }
})
const hashes = new Map()
for (const filename of files.filter(filename => !relative(filename).startsWith('.env'))) {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
  hashes.set(hash, [...(hashes.get(hash) || []), relative(filename)])
}
const report = {
  unreachableModules: source.filter(filename => /^(components|lib|data)\//.test(relative(filename)) && !reached.has(filename)).map(relative),
  exactDuplicates: [...hashes.values()].filter(group => group.length > 1),
  assets,
  note: 'Read-only audit. Dynamic asset paths, database URLs and tests loading source as text require manual review; nothing is deleted.'
}
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2))
else console.log(JSON.stringify({ unreachableModules: report.unreachableModules, exactDuplicates: report.exactDuplicates,
  assetsWithoutLiteralCodeReferences: assets.filter(asset => !asset.codeReferences.length).map(asset => asset.path), note: report.note }, null, 2))
