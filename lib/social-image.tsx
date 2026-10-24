import { SITE_NAME } from '@/data/site'
import { ImageResponse } from 'next/og'
export function socialImage(title: string, subtitle = 'Lan tỏa giá trị tốt đẹp · Thực hành theo Bác') {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', background: '#641421', color: '#FFF9ED', padding: '72px', border: '16px solid #D9B45B' }}><div style={{ fontSize: 26, color: '#D9B45B', marginBottom: 40 }}>{SITE_NAME}</div><div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.2 }}>{title.slice(0, 120)}</div><div style={{ fontSize: 26, marginTop: 40 }}>{subtitle}</div><div style={{ fontSize: 24, color: '#D9B45B', marginTop: 30 }}>KHU PHỐ 19 · PHƯỜNG TÂN THỚI HIỆP</div></div>, { width: 1200, height: 630 })
}
