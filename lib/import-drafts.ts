import { doc, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore'
import type { SeedEntry } from './seed-content'

export function importDraftEntries(db: Firestore, uid: string, entries: SeedEntry[]) {
  return runTransaction(db, async transaction => {
    const refs = entries.map(entry => doc(db, entry.collection, entry.id))
    const existing = await Promise.all(refs.map(ref => transaction.get(ref)))
    let imported = 0
    entries.forEach((entry, index) => {
      if (existing[index].exists()) return
      transaction.set(refs[index], { ...entry.record, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: uid })
      imported++
    })
    return { imported, skipped: entries.length - imported }
  })
}
