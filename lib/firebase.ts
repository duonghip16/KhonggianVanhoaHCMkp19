import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
export function firebaseApp() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  if (!apiKey || !projectId || !appId || !authDomain) return null
  const name = `kp19:${projectId}:${appId}`
  return getApps().find(app => app.name === name) ?? initializeApp({ apiKey, projectId, appId, authDomain,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }, name)
}
export function firebaseDb() { const app = firebaseApp(); return app ? getFirestore(app) : null }
export function firebaseAuth() { const app = firebaseApp(); return app ? getAuth(app) : null }
