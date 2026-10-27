import { readFileSync } from 'node:fs'

const defaults = JSON.parse(readFileSync(new URL('../firebase/web-config.json', import.meta.url), 'utf8'))
const required = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'APP_ID']
const optional = ['STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'MEASUREMENT_ID']
const key = suffix => `NEXT_PUBLIC_FIREBASE_${suffix}`

// Only these public Web fields may enter Next's client bundle.
export function firebaseWebConfig(env = process.env) {
  const value = suffix => env[key(suffix)]?.trim() || ''
  const differentProject = value('PROJECT_ID') && value('PROJECT_ID') !== defaults[key('PROJECT_ID')]
  if (differentProject && required.some(suffix => !value(suffix))) {
    throw new Error('Đổi Firebase project cần cấu hình đủ NEXT_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID và APP_ID; không ghép cấu hình của hai project.')
  }
  const config = Object.fromEntries([...required, ...optional].map(suffix => [key(suffix), value(suffix) || (differentProject ? '' : defaults[key(suffix)]) || '']))
  if (required.some(suffix => !config[key(suffix)])) throw new Error('Thiếu cấu hình Firebase Web bắt buộc.')
  const appProjectNumber = config[key('APP_ID')].split(':')[1]
  if (config[key('MESSAGING_SENDER_ID')] && config[key('MESSAGING_SENDER_ID')] !== appProjectNumber) {
    throw new Error('Firebase APP_ID và MESSAGING_SENDER_ID không cùng project.')
  }
  return config
}
