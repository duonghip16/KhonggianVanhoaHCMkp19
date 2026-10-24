import { doc, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore'
import { blankRecord, recordRevision } from './admin'
import { editorialErrors, type EditorialRecord, type EditorialStatus, type ManagedCollection } from './editorial'

function normalize(id: string, data: Record<string, unknown>): EditorialRecord {
  return { ...blankRecord(), ...data, id, title: String(data.title || String(data.text || '').slice(0, 80) || 'Bài gửi') } as EditorialRecord
}

export async function updateAdminRecord(db: Firestore, col: ManagedCollection, record: EditorialRecord, baseline: EditorialRecord, uid: string) {
  if (!record.id || editorialErrors(col, record).length) throw new Error('INVALID_RECORD')
  await runTransaction(db, async transaction => {
    const ref = doc(db, col, record.id!)
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists() || recordRevision(normalize(snapshot.id, snapshot.data())) !== recordRevision(baseline)) throw new Error('EDIT_CONFLICT')
    const { id: _id, ...fields } = record
    void _id
    transaction.update(ref, { ...fields, updatedAt: serverTimestamp(), updatedBy: uid })
  })
}

export async function transitionAdminRecords(db: Firestore, col: ManagedCollection, records: EditorialRecord[], status: EditorialStatus, uid: string) {
  if (!records.length || records.length > 500 || records.some(record => !record.id)) throw new Error('INVALID_SELECTION')
  await runTransaction(db, async transaction => {
    const snapshots = await Promise.all(records.map(record => transaction.get(doc(db, col, record.id!))))
    snapshots.forEach((snapshot, index) => {
      if (!snapshot.exists()) throw new Error('EDIT_CONFLICT')
      const latest = normalize(snapshot.id, snapshot.data())
      if (recordRevision(latest) !== recordRevision(records[index])) throw new Error('EDIT_CONFLICT')
      if (editorialErrors(col, { ...latest, status }).length) throw new Error('INVALID_RECORD')
    })
    snapshots.forEach(snapshot => transaction.update(snapshot.ref, { status, updatedAt: serverTimestamp(), updatedBy: uid }))
  })
}
