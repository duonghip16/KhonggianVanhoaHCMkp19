import { validDate } from './editorial'
export type Contribution = { type: 'deeds' | 'messages'; text: string; name: string; title?: string; date?: string; consent: true }

export function validateContribution(value: unknown): Contribution | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const data = value as Record<string, unknown>
  if (Object.keys(data).some(key => !['type', 'text', 'name', 'title', 'date', 'consent'].includes(key))) return null
  if ((data.type !== 'deeds' && data.type !== 'messages') || data.consent !== true) return null
  if (typeof data.text !== 'string' || !data.text.trim() || data.text.length > 400 || typeof data.name !== 'string' || data.name.length > 60) return null
  if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 200)) return null
  if (data.date !== undefined && (typeof data.date !== 'string' || !validDate(data.date))) return null
  return { type: data.type, text: data.text.trim(), name: data.name.trim(), consent: true,
    ...(data.title !== undefined ? { title: (data.title as string).trim() } : {}),
    ...(data.date !== undefined ? { date: data.date as string } : {}),
  }
}

export function contributionWrite(project: string, id: string, data: Contribution) {
  const fields = Object.fromEntries(Object.entries({ text: data.text, name: data.name, status: 'pending', ...(data.title ? { title: data.title } : {}), ...(data.date ? { date: data.date } : {}) }).map(([key, value]) => [key, { stringValue: value }]))
  return {
    update: { name: `projects/${project}/databases/(default)/documents/${data.type}/${id}`, fields: { ...fields, consent: { booleanValue: true } } },
    currentDocument: { exists: false },
    updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
  }
}
