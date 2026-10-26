import type { EditorialRecord } from '@/lib/editorial'
import StatNumber from './StatNumber'
export default function VerifiedStats({ records }: { records: EditorialRecord[] }) {
  const metrics = [['activities', 'Hoạt động'], ['participants', 'Người tham gia'], ['deeds', 'Việc tốt được ghi nhận'], ['households', 'Hộ được hỗ trợ']]
  const verified = metrics.flatMap(([key, label]) => {
    const item = records.find(record => record.category === key && record.status === 'published' && record.period && record.source && record.verifiedBy && record.verifiedOn && Number.isFinite(record.value) && record.value >= 0)
    return item ? [{ item, label }] : []
  })
  if (!verified.length) return null
  return <div className="verified-stats">{verified.map(({ item, label }) => <div key={item.category}><StatNumber value={item.value} /><h3>{label}</h3><small>Kỳ {item.period}<br />Nguồn: {item.source}<br />Xác minh: {item.verifiedBy}, {item.verifiedOn}</small></div>)}</div>
}
