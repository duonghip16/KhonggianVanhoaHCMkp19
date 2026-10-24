import { existsSync, readdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'
const env = { ...process.env }
const runtimeRoot = path.resolve('.qa/java')
if (existsSync(runtimeRoot)) {
  const runtime = readdirSync(runtimeRoot).find(name => name.startsWith('jdk-'))
  if (runtime) { env.JAVA_HOME = path.join(runtimeRoot, runtime); env.PATH = path.join(env.JAVA_HOME, 'bin') + path.delimiter + env.PATH }
}
const command = 'npx firebase-tools emulators:exec --project demo-kp19 --only firestore,storage "node --test tests/firestore.test.mjs"'
const windows = process.platform === 'win32'
const windowsCommand = "& npx.cmd --yes firebase-tools emulators:exec --project demo-kp19 --only firestore,storage 'node --test tests/firestore.test.mjs'"
const child = windows ? spawn('powershell.exe', ['-NoProfile', '-Command', windowsCommand], { env, stdio: 'inherit' }) : spawn('/bin/sh', ['-c', command], { env, stdio: 'inherit' })
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
