'use client'
import { useEffect, useRef, useState } from 'react'
export default function StatNumber({ value, suffix = '' }: { value?: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null), [visible, setVisible] = useState(value)
  useEffect(() => {
    setVisible(value)
    if (value === undefined || !ref.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const animate = (now: number) => { const progress = Math.min(1, (now - start) / 850); setVisible(Math.round(value * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(animate) }
      frame = requestAnimationFrame(animate)
    })
    observer.observe(ref.current)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])
  return <strong ref={ref} aria-label={value === undefined ? 'Chờ số liệu xác minh' : value.toLocaleString('vi-VN') + suffix}>{visible === undefined ? '—' : visible.toLocaleString('vi-VN') + suffix}</strong>
}
