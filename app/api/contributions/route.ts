import { NextResponse } from 'next/server'
import { contributionWrite, validateContribution } from '@/lib/contributions'
import { reserveSubmission, submissionKey } from '@/lib/submission-limit'
import { reportServiceFailure, type ServiceErrorCode } from '@/lib/server-diagnostics'

export const runtime = 'nodejs'
const limited = (seconds: number) => NextResponse.json({ error: 'Bạn gửi quá nhanh. Vui lòng chờ rồi thử lại.', retryAfter: seconds }, { status: 429, headers: { 'Retry-After': String(seconds), 'Cache-Control': 'no-store' } })

export async function POST(request: Request) {
  const failure = (code: ServiceErrorCode, upstreamStatus?: number) => NextResponse.json({ error: 'Chưa gửi được nội dung. Vui lòng thử lại.', code, requestId: reportServiceFailure(code, upstreamStatus) }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 })
  let data
  try {
    if (Number(request.headers.get('content-length')) > 6000) return NextResponse.json({ error: 'Nội dung quá dài.' }, { status: 413 })
    const reader = request.body?.getReader()
    if (!reader) return NextResponse.json({ error: 'Thiếu nội dung.' }, { status: 400 })
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      length += chunk.value.byteLength
      if (length > 6000) { await reader.cancel(); return NextResponse.json({ error: 'Nội dung quá dài.' }, { status: 413 }) }
      chunks.push(chunk.value)
    }
    const raw = Buffer.concat(chunks).toString('utf8')
    data = validateContribution(JSON.parse(raw))
  } catch { return NextResponse.json({ error: 'Nội dung không hợp lệ.' }, { status: 400 }) }
  if (!data) return NextResponse.json({ error: 'Kiểm tra nội dung và đồng ý gửi xét duyệt.' }, { status: 400 })
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!project) return failure('FIREBASE_NOT_CONFIGURED')
  const wait = reserveSubmission(submissionKey(request))
  if (wait) return limited(wait)
  try {
    const signal = AbortSignal.timeout(10_000)
    const root = `projects/${project}/databases/(default)/documents`
    const gateName = `${root}/submission_limits/public`
    const gateResponse = await fetch(`https://firestore.googleapis.com/v1/${gateName}`, { cache: 'no-store', signal })
    if (!gateResponse.ok && gateResponse.status !== 404) return failure('CONTRIBUTION_GATE_UNAVAILABLE', gateResponse.status)
    const gate = gateResponse.ok ? await gateResponse.json() : null
    if (gate?.fields?.submittedAt?.timestampValue) {
      const remaining = Math.ceil((Date.parse(gate.fields.submittedAt.timestampValue) + 5000 - Date.now()) / 1000)
      if (remaining > 0) return limited(remaining)
    }
    const id = crypto.randomUUID()
    const gateWrite = {
      update: { name: gateName, fields: { collection: { stringValue: data.type }, id: { stringValue: id } } },
      currentDocument: gate ? { updateTime: gate.updateTime } : { exists: false },
      updateTransforms: [{ fieldPath: 'submittedAt', setToServerValue: 'REQUEST_TIME' }],
    }
    // Rules enforce the global cooldown and require both writes in the same commit.
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:commit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal,
      body: JSON.stringify({ writes: [contributionWrite(project, id, data), gateWrite] }),
    })
    if ([409, 412].includes(response.status)) return limited(5)
    if (response.status === 403) {
      // A concurrent commit advances the gate; an unchanged gate indicates a Rules/configuration failure.
      const latest = await fetch(`https://firestore.googleapis.com/v1/${gateName}`, { cache: 'no-store', signal })
      if (latest.ok) {
        const current = await latest.json()
        if (current.updateTime && current.updateTime !== gate?.updateTime) return limited(5)
      }
      return failure('CONTRIBUTION_WRITE_DENIED', response.status)
    }
    if (!response.ok) return failure('CONTRIBUTION_WRITE_UNAVAILABLE', response.status)
    const result = await response.json()
    if (result.error || !Array.isArray(result.writeResults) || result.writeResults.length !== 2) return failure('CONTRIBUTION_INVALID_RESPONSE')
    return NextResponse.json({ saved: true }, { status: 201 })
  } catch { return failure('CONTRIBUTION_SERVICE_UNAVAILABLE') }
}
