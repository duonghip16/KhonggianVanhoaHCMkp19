export type ServiceErrorCode =
  | 'FIREBASE_NOT_CONFIGURED'
  | 'CONTRIBUTION_GATE_UNAVAILABLE'
  | 'CONTRIBUTION_WRITE_DENIED'
  | 'CONTRIBUTION_WRITE_UNAVAILABLE'
  | 'CONTRIBUTION_INVALID_RESPONSE'
  | 'CONTRIBUTION_SERVICE_UNAVAILABLE'
  | 'MEDIA_UPLOAD_UNAVAILABLE'

// Keep diagnostics independent of request bodies, credentials and upstream error text.
export function reportServiceFailure(code: ServiceErrorCode, upstreamStatus?: number) {
  const requestId = crypto.randomUUID()
  console.error(JSON.stringify({ event: code, requestId, ...(upstreamStatus === undefined ? {} : { upstreamStatus }) }))
  return requestId
}
