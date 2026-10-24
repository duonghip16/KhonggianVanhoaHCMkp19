'use client'
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

export default function BeforeAfter({ before, after, label }: { before?: string; after?: string; label: string }) {
  const [p, setP] = useState(50)
  const layer = (src: string | undefined, name: string, cls: string, style?: React.CSSProperties) => (
    <div className={'ba-l ' + cls} style={style}>
      {src ? <img src={src} alt={`${label} – ${name}`} />
        : <div className="ph"><div>[ẢNH THỰC TẾ KHU PHỐ 19]<small>Ảnh {name.toLowerCase()} – chờ bổ sung</small></div></div>}
      <span className="ba-t">{name}</span>
    </div>
  )
  return (
    <div className="ba">
      {layer(after, 'SAU', 'a')}
      {layer(before, 'TRƯỚC', 'b', { clipPath: `inset(0 ${100 - p}% 0 0)` })}
      <div className="ba-h" style={{ left: p + '%' }} aria-hidden="true"><i>⇆</i></div>
      <input type="range" min={0} max={100} value={p} onChange={e => setP(+e.target.value)} aria-label={`Kéo để so sánh trước và sau: ${label}`} />
    </div>
  )
}
