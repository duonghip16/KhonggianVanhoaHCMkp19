import { firebaseAuth, firebaseDb } from './firebase'
import { editorialErrors } from './editorial'
import { importDraftEntries } from './import-drafts'

export async function importStarterContent() {
  const user = firebaseAuth()?.currentUser
  const db = firebaseDb()
  if (!user || !db || (await user.getIdTokenResult(true)).claims.admin !== true) throw new Error('Cần đăng nhập bằng tài khoản quản trị.')
  const { starterContent } = await import('./seed-content')
  const entries = starterContent()
  if (entries.some(entry => editorialErrors(entry.collection, entry.record).length)) throw new Error('Bộ tư liệu chưa hợp lệ.')
  return importDraftEntries(db, user.uid, entries)
}
