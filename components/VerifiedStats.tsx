import type { EditorialRecord } from '@/lib/editorial'
import StatNumber from './StatNumber'
import { COMMUNITY_STATS } from '@/data/community-stats'
export default function VerifiedStats({ records }: { records: EditorialRecord[] }) {
  const metrics = [['activities', 'Hoạt động'], ['participants', 'Người tham gia'], ['deeds', 'Việc tốt được ghi nhận'], ['households', 'Hộ được hỗ trợ']]
  return <div className="verified-stats">{metrics.map(([key, label]) => { const item = records.find(record => record.category === key); return <div key={key}><StatNumber value={item?.value ?? COMMUNITY_STATS[key]} suffix={item ? '' : '+'} /><h3>{label}</h3>{item && <small>Kỳ {item.period}<br />Nguồn: {item.source}<br />Xác minh: {item.verifiedBy}, {item.verifiedOn}</small>}</div> })}</div>
}
