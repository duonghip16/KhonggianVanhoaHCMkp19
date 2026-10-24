'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { safeUrl } from '@/lib/editorial'

export default function MediaPreview({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [url])
  if (!url || !safeUrl(url)) return null
  return <div className="cms-media-preview">{failed ? <p role="status">Ảnh chưa tải được. Kiểm tra đường dẫn hoặc thử tải ảnh khác.</p> : <Image src={url} alt={title || 'Ảnh đang biên tập'} width={900} height={600} unoptimized onError={() => setFailed(true)} />}<a href={url} target="_blank" rel="noopener noreferrer">Mở ảnh gốc ↗</a></div>
}
