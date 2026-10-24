'use client'
import { useState } from 'react'
import type { EditorialRecord } from '@/lib/editorial'

const A: Record<string, string> = {
  'Đạo đức': 'Nhặt một vật rơi trước cửa nhà hoặc ngõ và bỏ đúng nơi quy định.',
  'Đoàn kết': 'Hỏi thăm một người hàng xóm mà bạn ít khi trò chuyện.',
  'Học tập': 'Dành 15 phút đọc một bài viết hoặc cuốn sách bổ ích, rồi kể lại cho một người thân.',
  'Phục vụ cộng đồng': 'Giúp một người lớn tuổi trong khu phố một việc vặt trong khả năng của bạn.',
}

export default function DailyAction({ challenges = [] }: { challenges?: EditorialRecord[] }) {
  const actions = challenges.length ? challenges.map(item => ({ category: item.category, title: item.title, text: item.text })) : Object.entries(A).map(([category, text]) => ({ category, title: '', text }))
  const categories = Array.from(new Set(actions.map(item => item.category)))
  const [v, setV] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const choices = actions.filter(item => item.category === v)
  const current = choices[index % (choices.length || 1)]
  return (
    <section className="daily on-light" id="hanh-dong" aria-labelledby="hd">
      <p className="eyebrow">Hành động mỗi ngày</p>
      <h2 id="hd">Hôm nay bạn muốn lan tỏa giá trị nào?</h2>
      <div className="chips" role="group" aria-label="Chọn một giá trị">
        {categories.map(k => (
          <button key={k} type="button" className="chip" aria-pressed={v === k} onClick={() => { setV(k); setIndex(0) }}>{k}</button>
        ))}
      </div>
      <div className={'acard' + (v ? ' show' : '')} key={v ?? 'none'} role="status" aria-live="polite">
        <small>Giá trị hôm nay</small><h3>{v}</h3>
        <small>Một việc nhỏ bạn có thể làm</small>{current?.title && <p><strong>{current.title}</strong></p>}<p>{current?.text || ''}</p>
        {choices.length > 1 && <><p>{index % choices.length + 1} / {choices.length} gợi ý trong nhóm này</p><button type="button" className="chip" onClick={() => setIndex(value => value + 1)}>Gợi ý việc khác →</button></>}
      </div>
    </section>
  )
}
