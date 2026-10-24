import { validDate } from './editorial'

export function displayDate(value: string) {
  return validDate(value) ? new Intl.DateTimeFormat('vi-VN', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00Z`)) : value
}
