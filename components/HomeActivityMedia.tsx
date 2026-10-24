'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { EditorialRecord } from '@/lib/editorial'
import type { HOME_MEDIA } from '@/data/home-media'

export default function HomeActivityMedia({ item, fallback }: { item?: EditorialRecord; fallback: typeof HOME_MEDIA[number] }) {
  const [failedUrl, setFailedUrl] = useState('')
  const useCms = !!item?.url && item.url !== failedUrl
  return <figure className="kp19-community-photo"><Image src={useCms ? item!.url : fallback.src} alt={useCms ? item!.title : fallback.caption} width={fallback.width} height={fallback.height} sizes="(max-width: 700px) 90vw, 44vw" unoptimized={useCms && !item!.url.startsWith('/')} onError={() => { if (useCms) setFailedUrl(item!.url) }} /><figcaption>{useCms ? item!.title : fallback.caption}</figcaption></figure>
}
