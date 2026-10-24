import { createHash } from 'node:crypto'

const visitors = new Map<string, number[]>()
export function submissionKey(request: Request) {
  // Only hosting platforms that overwrite this header should set CONTRIBUTION_IP_HEADER.
  const header = process.env.CONTRIBUTION_IP_HEADER
  const address = header ? request.headers.get(header)?.split(',')[0].trim() : undefined
  return createHash('sha256').update(address || 'shared-unidentified-visitors').digest('hex')
}
export function reserveSubmission(key: string, now = Date.now()) {
  for (const [id, times] of visitors) if (!times.length || times.at(-1)! <= now - 900_000) visitors.delete(id)
  const times = (visitors.get(key) || []).filter(time => time > now - 900_000)
  const wait = Math.max(times.length ? times.at(-1)! + 60_000 - now : 0, times.length >= 5 ? times[0] + 900_000 - now : 0)
  if (wait > 0) return Math.ceil(wait / 1000)
  if (visitors.size >= 10_000 && !visitors.has(key)) return 60
  visitors.set(key, [...times, now])
  return 0
}
