'use client'
import ReadingPopup from '@/components/ReadingPopup'
import { useState } from 'react'
import { SOURCES, VALUES } from '@/data/content'
const petals = [
  { title: 'Yêu thương', text: 'Quan tâm đến hoàn cảnh cụ thể của người khác, giúp đỡ bằng việc làm phù hợp.', action: 'Hỏi thăm một người lớn tuổi và lắng nghe điều họ cần.', index: 0 },
  { title: 'Trách nhiệm', text: 'Nhận việc, làm đến nơi đến chốn và chịu trách nhiệm về phần việc của mình.', action: 'Hoàn thành một việc đã hứa với gia đình hoặc cộng đồng.', index: 0 },
  { title: 'Tiết kiệm', text: 'Trân trọng thời gian, công sức và nguồn lực chung; sử dụng đúng nhu cầu.', action: 'Tắt thiết bị điện không dùng và giảm một món đồ dùng một lần.', index: 0 },
  { title: 'Đoàn kết', text: 'Lắng nghe, tôn trọng khác biệt và cùng hướng đến công việc chung.', action: 'Cùng hàng xóm bàn bạc một việc có ích cho không gian sống.', index: 1 },
  { title: 'Học tập', text: 'Tiếp tục học hỏi, đối chiếu nguồn và vận dụng kiến thức vào thực hành.', action: 'Đọc một tư liệu trong thư viện và kể lại điều bạn học được.', index: 2 },
  { title: 'Cống hiến', text: 'Đóng góp trong khả năng của mình cho lợi ích của cộng đồng.', action: 'Dành một khoảng thời gian giúp người khác hoặc công việc chung.', index: 3 },
]
export default function ValueLotus() {
  const [selected, setSelected] = useState(0)
  const value = petals[selected]
  return <section className="value-lotus on-light" aria-labelledby="lotus-title"><p className="eyebrow">Bông sen giá trị</p><h2 id="lotus-title">Chạm một cánh sen.<br />Bắt đầu một việc tốt.</h2><div className="lotus-layout"><div className="lotus-selector" role="group" aria-label="Chọn giá trị thực hành"><svg className="lotus-line" viewBox="0 0 100 100" aria-hidden="true"><use href="#kp19-lotus" /></svg>{petals.map((petal, index) => <button key={petal.title} className={`petal petal-${index}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, '0')}</span>{petal.title}</button>)}</div><div className="value-panel" aria-live="polite"><span className="value-number">{String(selected + 1).padStart(2, '0')}</span><h3>{value.title}</h3><p>{value.text}</p><div className="practice"><small>BẠN CÓ THỂ LÀM GÌ HÔM NAY?</small><p>{value.action}</p></div><ReadingPopup sourceUrl={selected === 0 ? SOURCES.children : VALUES[value.index].source}>Đọc bài tư liệu →</ReadingPopup><small className="editorial-note">Gợi ý thực hành do trang biên tập từ nguồn dẫn kèm.</small></div></div></section>
}
