import 'server-only'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

export async function verifyUploadAdmin(token: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!projectId) throw new Error('Missing Firebase project')
  const name = `upload:${projectId}`
  const app = getApps().find(item => item.name === name) || initializeApp({ projectId }, name)
  const claims = await getAuth(app).verifyIdToken(token)
  return claims.admin === true
}
