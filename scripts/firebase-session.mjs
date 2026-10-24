import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

export function firebaseEnvironment() {
  const env = { ...process.env }
  if (existsSync('.env.local')) {
    for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const match = line.match(/^([A-Z_]+)\s*=\s*(.*?)\s*$/)
      if (match && env[match[1]] === undefined) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
    }
  }
  return env
}

export function firebaseProject() {
  const project = firebaseEnvironment().NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const configured = JSON.parse(readFileSync('.firebaserc', 'utf8')).projects.default
  if (!project || project !== configured) throw new Error('Project trong env không khớp .firebaserc. Dừng để tránh ghi nhầm database.')
  return project
}

export async function firebaseSession() {
  const require = createRequire(import.meta.url)
  const candidates = (process.env.PATH ?? '').split(path.delimiter).map(dir => path.resolve(dir, '../firebase-tools/lib/auth.js'))
  const authPath = candidates.find(candidate => existsSync(candidate))
  if (!authPath) throw new Error('Chạy bằng npm run firebase:seed để dùng Firebase CLI đúng phiên bản.')
  // The pinned CLI owns token storage and refresh. Never copy tokens into project env.
  const { logger } = require(path.join(path.dirname(authPath), 'logger.js'))
  logger.debug = () => {}
  const auth = require(authPath)
  const account = auth.getProjectDefaultAccount(process.cwd())
  if (!account) throw new Error('Firebase CLI chưa đăng nhập. Chạy npx firebase-tools login trước.')
  const tokens = await auth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform'])
  if (!tokens.access_token) throw new Error('Chưa lấy được phiên xác thực Firebase.')
  return { accessToken: tokens.access_token, operator: `google:${account.user.sub ?? account.user.email}`, email: account.user.email }
}
