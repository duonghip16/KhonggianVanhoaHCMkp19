import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { randomBytes, createHash } from 'node:crypto'
import { firebaseEnvironment, firebaseProject, firebaseSession } from './firebase-session.mjs'

try {
  const project = firebaseProject()
  const { accessToken, email } = await firebaseSession()
  if (typeof email !== 'string' || !email.includes('@')) throw new Error('Phiên Google chưa có email hợp lệ.')
  const redactions = [accessToken, email, firebaseEnvironment().NEXT_PUBLIC_FIREBASE_API_KEY].filter(Boolean)
  const apply = process.argv.includes('--apply')
  const request = async (url, body, method = body ? 'POST' : 'GET', allowMissingUser = false) => {
    const response = await fetch(url, { method, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) })
    const data = await response.json()
    if (allowMissingUser && data.error?.message === 'USER_NOT_FOUND') return { users: [] }
    if (!response.ok || data.error) {
      const code = data.error?.message?.match(/^[A-Z_]+(?=\s|:|$)/)?.[0] ?? data.error?.status ?? 'REQUEST_FAILED'
      let detail = String(data.error?.message ?? '')
      for (const secret of redactions) detail = detail.replaceAll(secret, '[redacted]')
      throw new Error(`Firebase Auth ${new URL(url).pathname.split('/').pop()}: HTTP ${response.status} (${code}). ${detail.slice(0,400)}`)
    }
    return data
  }
  const configUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`
  const config = await request(configUrl)
  if (!config.signIn?.email?.enabled) {
    if (apply) {
      await request(`${configUrl}?updateMask=signIn.email.enabled,signIn.email.passwordRequired`, { signIn: { email: { enabled: true, passwordRequired: true } } }, 'PATCH')
      console.log('Đã bật đăng nhập Email/Password.')
    } else console.log('Cần bật đăng nhập Email/Password.')
  } else console.log('Đăng nhập Email/Password đã sẵn sàng.')
  const base = `https://identitytoolkit.googleapis.com/v1/projects/${project}/accounts`
  const found = await request(`${base}:lookup?fields=users(localId,email,disabled,customAttributes)`, { email: [email] }, 'POST', true)
  let user = found.users?.find(item => item.email.toLowerCase() === email.toLowerCase())
  if (user?.disabled) throw new Error('Tài khoản tương ứng đang bị khóa; không tự mở khóa hoặc đổi mật khẩu.')
  if (!apply) {
    console.log(user ? 'Đã có tài khoản cùng email Google; kiểm tra/cấp claim admin khi chạy --apply.' : 'Sẽ tạo tài khoản quản trị cùng email Google đã đăng nhập; mật khẩu mới lưu cục bộ.')
    console.log('Chỉ kiểm tra; chưa đổi cấu hình hoặc tài khoản.')
  } else {
    if (!user) {
      const filename = '.qa/firebase-admin-login.json'
      await mkdir('.qa', { recursive: true })
      let credentials
      if (existsSync(filename)) {
        credentials = JSON.parse(await readFile(filename, 'utf8'))
        if (credentials.project !== project || credentials.email !== email || typeof credentials.password !== 'string' || credentials.password.length < 24) throw new Error('Tệp thông tin quản trị đã có không khớp project/email; giữ nguyên tệp.')
      } else {
        credentials = { project, email, password: `KP19!${randomBytes(24).toString('base64url')}aA7`, loginPath: '/admin' }
        await writeFile(filename, JSON.stringify(credentials, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
      }
      redactions.push(credentials.password)
      const created = await request(`https://identitytoolkit.googleapis.com/v1/accounts:signUp`, {
        targetProjectId: project, localId: `kp19-admin-${createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0,24)}`,
        email, password: credentials.password, emailVerified: false, displayName: 'Quản trị viên',
      })
      if (!created.localId) throw new Error('Chưa xác nhận được tài khoản quản trị đã tạo.')
      user = { localId: created.localId, customAttributes: '{}' }
      console.log('Đã tạo tài khoản quản trị. Thông tin đăng nhập nằm tại .qa/firebase-admin-login.json (không đưa vào mã nguồn hoặc env client).')
    }
    const claims = JSON.parse(user.customAttributes || '{}')
    if (claims.admin !== true) {
      await request(`${base}:update`, { localId: user.localId, customAttributes: JSON.stringify({ ...claims, admin: true }) })
      console.log('Đã cấp custom claim admin cho tài khoản cùng email Google đã xác thực; giữ nguyên các claim khác.')
    } else console.log('Tài khoản đã có quyền admin; giữ nguyên cấu hình.')
    const verified = await request(`${base}:lookup?fields=users(localId,customAttributes)`, { localId: [user.localId] })
    if (JSON.parse(verified.users?.[0]?.customAttributes || '{}').admin !== true) throw new Error('Chưa xác nhận được claim admin.')
    console.log('Đã xác nhận quyền quản trị trên Firebase Auth.')
  }
} catch (error) {
  console.error(error instanceof Error && !/token|https?:\/\//i.test(error.message) ? error.message : 'Chưa hoàn tất thiết lập quản trị. Kiểm tra phiên Google và quyền project.')
  process.exitCode = 1
}
