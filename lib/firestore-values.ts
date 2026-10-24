export type FirestoreValue = {
  stringValue?: string; integerValue?: string; doubleValue?: number;
  timestampValue?: string; booleanValue?: boolean; nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

export function decodeFirestoreValue(value: FirestoreValue): unknown {
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('timestampValue' in value) return value.timestampValue
  if ('booleanValue' in value) return value.booleanValue
  if ('nullValue' in value) return null
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decodeFirestoreValue)
  if (value.mapValue) return decodeFirestoreFields(value.mapValue.fields ?? {})
  return undefined
}

export function decodeFirestoreFields(fields: Record<string, FirestoreValue>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]))
}
